const ipfsAPI = require("ipfs-mini");
const ipfs = new ipfsAPI({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https"
});
export default ipfs;
