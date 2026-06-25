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
    }

    uint256 public recordCount;
    mapping(uint256 => PriceRecord) public records;

    // ==================== EVENTS ====================
    event ExporterAdded(address indexed account);
    event VerifierAdded(address indexed account);
    event PriceSubmitted(uint256 id, string exporter, uint256 price, address submittedBy);
    event PriceVerified(uint256 id, address verifiedBy, string remarks);
    event PriceRejected(uint256 id, address rejectedBy, string reason);

    // ==================== MODIFIERS ====================
    modifier onlyOwner() {
        require(msg.sender == owner, "Hanya owner (DGCE) yang bisa akses");
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

    // ==================== EXPORTER FUNCTIONS ====================
    function submitPrice(
        string memory _exporter,
        uint256 _priceUSDCents,
        uint256 _qualityKcal,
        string memory _priceSource
    ) public onlyExporter {
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
            remarks: ""
        });
        emit PriceSubmitted(recordCount, _exporter, _priceUSDCents, msg.sender);
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

    // ==================== PUBLIC VIEW FUNCTIONS ====================
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