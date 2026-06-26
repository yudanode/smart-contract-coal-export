// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoalPriceRegistry {

    // ==================== ROLES ====================
    address public owner;
    mapping(address => bool) public verifiers;
    mapping(address => bool) public exporters;

    // ==================== DATA ====================
    struct PriceRecord {
        uint256 id;
        string exporter;
        uint256 priceUSDCents;
        uint256 qualityKcal;
        string priceSource;
        address submittedBy;
        uint256 timestamp;
        bool verified;
        address verifiedBy;
        string remarks;
        bool flagged;        // fraud detection flag
        string flagReason;   // alasan flagging
    }

    uint256 public recordCount;
    mapping(uint256 => PriceRecord) public records;

    // ==================== HARGA REFERENSI ====================
    // Batas harga wajar per range Kcal (dalam sen USD)
    // Low: 4200-4999 Kcal → $60-$90/ton
    // Medium: 5000-5499 Kcal → $85-$110/ton  
    // High: 5500-5999 Kcal → $100-$125/ton
    // Premium: 6000+ Kcal → $115-$140/ton

    // ==================== EVENTS ====================
    event ExporterAdded(address indexed account);
    event VerifierAdded(address indexed account);
    event PriceSubmitted(uint256 id, string exporter, uint256 price, address submittedBy, bool flagged);
    event PriceVerified(uint256 id, address verifiedBy, string remarks);
    event RecordFlagged(uint256 id, string reason);

    // ==================== MODIFIERS ====================
    modifier onlyOwner() {
        require(msg.sender == owner, "Hanya owner yang bisa akses");
        _;
    }

    modifier onlyVerifier() {
        require(verifiers[msg.sender] || msg.sender == owner, "Hanya verifikator resmi");
        _;
    }

    modifier onlyExporter() {
        require(exporters[msg.sender] || msg.sender == owner, "Hanya eksportir terdaftar");
        _;
    }

    // ==================== CONSTRUCTOR ====================
    constructor() {
        owner = msg.sender;
        verifiers[msg.sender] = true;
        exporters[msg.sender] = true;
    }

    // ==================== FRAUD DETECTION ====================
    function detectFraud(uint256 _priceUSDCents, uint256 _qualityKcal) 
        public pure returns (bool flagged, string memory reason) {
        
        uint256 minPrice;
        uint256 maxPrice;

        if (_qualityKcal >= 6000) {
            minPrice = 11500; // $115
            maxPrice = 14000; // $140
        } else if (_qualityKcal >= 5500) {
            minPrice = 10000; // $100
            maxPrice = 12500; // $125
        } else if (_qualityKcal >= 5000) {
            minPrice = 8500;  // $85
            maxPrice = 11000; // $110
        } else if (_qualityKcal >= 4200) {
            minPrice = 6000;  // $60
            maxPrice = 9000;  // $90
        } else {
            return (true, "Kualitas Kcal terlalu rendah (minimum 4200 Kcal)");
        }

        if (_priceUSDCents < minPrice) {
            return (true, "Harga terlalu rendah untuk kualitas ini (possible underpricing)");
        }
        if (_priceUSDCents > maxPrice) {
            return (true, "Harga terlalu tinggi untuk kualitas ini (possible overpricing)");
        }

        return (false, "");
    }

    // ==================== EXPORTER FUNCTIONS ====================
    function submitPrice(
        string memory _exporter,
        uint256 _priceUSDCents,
        uint256 _qualityKcal,
        string memory _priceSource
    ) public onlyExporter {
        
        // Jalankan fraud detection otomatis
        (bool flagged, string memory reason) = detectFraud(_priceUSDCents, _qualityKcal);
        
        recordCount++;
        records[recordCount] = PriceRecord({
            id: recordCount,
            exporter: _exporter,
            priceUSDCents: _priceUSDCents,
            qualityKcal: _qualityKcal,
            priceSource: _priceSource,
            submittedBy: msg.sender,
            timestamp: block.timestamp,
            verified: false,
            verifiedBy: address(0),
            remarks: "",
            flagged: flagged,
            flagReason: reason
        });

        emit PriceSubmitted(recordCount, _exporter, _priceUSDCents, msg.sender, flagged);
        if (flagged) emit RecordFlagged(recordCount, reason);
    }

    // ==================== VERIFIER FUNCTIONS ====================
    function verifyPrice(uint256 _id, string memory _remarks) public onlyVerifier {
        require(_id > 0 && _id <= recordCount, "ID tidak valid");
        require(!records[_id].verified, "Sudah diverifikasi");
        records[_id].verified = true;
        records[_id].verifiedBy = msg.sender;
        records[_id].remarks = _remarks;
        emit PriceVerified(_id, msg.sender, _remarks);
    }

    function clearFlag(uint256 _id) public onlyVerifier {
        require(_id > 0 && _id <= recordCount, "ID tidak valid");
        records[_id].flagged = false;
        records[_id].flagReason = "";
    }

    // ==================== OWNER FUNCTIONS ====================
    function addVerifier(address _account) public onlyOwner {
        verifiers[_account] = true;
        emit VerifierAdded(_account);
    }

    function addExporter(address _account) public onlyOwner {
        exporters[_account] = true;
        emit ExporterAdded(_account);
    }

    function removeVerifier(address _account) public onlyOwner {
        verifiers[_account] = false;
    }

    function removeExporter(address _account) public onlyOwner {
        exporters[_account] = false;
    }

    // ==================== VIEW FUNCTIONS ====================
    function getRecord(uint256 _id) public view returns (PriceRecord memory) {
        return records[_id];
    }

    function isVerifier(address _account) public view returns (bool) {
        return verifiers[_account];
    }

    function isExporter(address _account) public view returns (bool) {
        return exporters[_account];
    }
}