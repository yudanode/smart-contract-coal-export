export const CONTRACT_ADDRESS = "0x7d7C419Bc4CE2E27F1afDAe6C9304ce6D7ecd760";

export const ABI = [
  "function submitPrice(string memory _exporter, uint256 _priceUSDCents, uint256 _qualityKcal, string memory _priceSource) public",
  "function verifyPrice(uint256 _id, string memory _remarks) public",
  "function clearFlag(uint256 _id) public",
  "function addVerifier(address _account) public",
  "function addExporter(address _account) public",
  "function removeVerifier(address _account) public",
  "function removeExporter(address _account) public",
  "function getRecord(uint256 _id) public view returns (tuple(uint256 id, string exporter, uint256 priceUSDCents, uint256 qualityKcal, string priceSource, address submittedBy, uint256 timestamp, bool verified, address verifiedBy, string remarks, bool flagged, string flagReason))",
  "function recordCount() public view returns (uint256)",
  "function isVerifier(address _account) public view returns (bool)",
  "function isExporter(address _account) public view returns (bool)",
  "function owner() public view returns (address)",
  "function detectFraud(uint256 _priceUSDCents, uint256 _qualityKcal) public pure returns (bool flagged, string memory reason)"
];