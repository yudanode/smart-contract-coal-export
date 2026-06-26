const hre = require("hardhat");

async function main() {
  const CONTRACT = "0x7d7C419Bc4CE2E27F1afDAe6C9304ce6D7ecd760";
  const ABI = [
    "function submitPrice(string,uint256,uint256,string) public"
  ];
  
  const [signer] = await hre.ethers.getSigners();
  const contract = new hre.ethers.Contract(CONTRACT, ABI, signer);

  const data = [
    ["PT. Nusantara Coal Resources", 8750, 4800, "HDMA"],
    ["PT. Kalimantan Prima Energy", 10250, 5500, "Argus"],
    ["PT. Borneo Energi Mandiri", 9100, 5000, "Platts"],
    ["PT. Sumatera Coal Internasional", 7600, 4200, "HDMA"],
    ["PT. Indo Pacific Mining", 20000, 4200, "Argus"], // anomali: harga terlalu tinggi
  ];

  for (const [exporter, price, quality, source] of data) {
    const tx = await contract.submitPrice(exporter, price, quality, source);
    await tx.wait();
    console.log(`✅ Submitted: ${exporter} - $${price/100}/ton`);
  }
}

main().catch(console.error);