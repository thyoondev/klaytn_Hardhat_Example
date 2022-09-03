import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { BytesLike } from 'ethers/lib/utils';

dotenv.config();

async function main() {
  const account = '0x8F06fe2c39BD3655027f4331C7DC6d6660b1FA68';
  const url = process.env.KLAYTN_URL;
  // @ts-ignore
  const priv: BytesLike = process.env.PRIVATE_KEY;
  const provider = new ethers.providers.JsonRpcProvider(url);
  const wallet = new ethers.Wallet(priv, provider);

  const tx = await wallet.sendTransaction({
    to: account,
    value: '1000000000000000000',
    gasPrice: 250000000000,
    gasLimit: 21000,
  });

  const receipt = await tx.wait();
  console.log(receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
