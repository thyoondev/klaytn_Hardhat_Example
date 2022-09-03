import { expect } from 'chai';
import { ethers } from 'hardhat';
import { KlayBank } from '../typechain';

let klayBank: KlayBank;

const deployedContract: string = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

describe('KlayBank의 인스턴스가 생성되어야 합니다.', function () {
  before(async function () {
    klayBank = (await ethers.getContractAt(
      'KlayBank',
      deployedContract
    )) as KlayBank;
  });
  it('예금 시 사용자 잔액이 증가해야 합니다.', async function () {
    const signer = await ethers.getSigners();
    const _depositor1 = signer[0].address;
    const _depositorSigner = await ethers.getSigner(_depositor1);

    const balance: any = await klayBank.getBalance(_depositor1);

    const option = { value: ethers.utils.parseEther('1') };
    const deposit: any = await klayBank
      .connect(_depositorSigner)
      .deposit(option);
    const tx = await deposit.wait();
    const value = tx.events[0].args[0];
    const depositor = tx.events[0].args[1];

    const balanceAfter: any = await klayBank.getBalance(_depositor1);

    expect(Number(balance.toString()) + Number(value.toString())).to.equal(
      Number(balanceAfter.toString())
    );
    expect(_depositor1).to.equal(depositor);
  });

  it('입금 및 출금시 각각의 계정의 잔액은 감소 및 증가해야 합니다.', async function () {
    const signer = await ethers.getSigners();
    const _depositor1 = signer[0].address;
    const _depositorSigner = await ethers.getSigner(_depositor1);

    const balance: any = await klayBank.getBalance(_depositor1);
    const recipientBalB4: any = await klayBank.getBalance(signer[1].address);

    const withdraw: any = await klayBank
      .connect(_depositorSigner)
      .withdraw(signer[1].address, '5000000000');
    const tx = await withdraw.wait();
    const value = tx.events[0].args[0];
    const depositor = tx.events[0].args[1];
    const recipient = tx.events[0].args[2];

    const balanceAfter: any = await klayBank.getBalance(_depositor1);
    const recBalanceAfter: any = await klayBank.getBalance(signer[1].address);

    expect(Number(balance.toString()) - Number(value.toString())).to.equal(
      Number(balanceAfter.toString())
    );
    expect(
      Number(recipientBalB4.toString()) + Number(value.toString())
    ).to.equal(Number(recBalanceAfter.toString()));
    expect(_depositor1).to.equal(depositor);
    expect(signer[1].address).to.equal(recipient);
  });

  it('계정 주소가 0인 계정으로 입금할 때 트랜잭션이 되돌려져야합니다.', async function () {
    const signer = await ethers.getSigners();
    const _depositor1 = signer[0].address;
    const _depositorSigner = await ethers.getSigner(_depositor1);

    await expect(
      klayBank
        .connect(_depositorSigner)
        .withdraw(ethers.constants.AddressZero, '5000000000')
    ).to.be.revertedWith('KlayBank: Cannot Send to Address Zero');
  });

  it('이체 금액이 잔액보다 클 때 트랜잭션이 되돌려져야합니다.', async function () {
    const signer = await ethers.getSigners();
    const _depositor1 = signer[0].address;
    const _depositorSigner = await ethers.getSigner(_depositor1);

    const balanceB4: any = await klayBank.getBalance(_depositor1);

    const balance: any = await klayBank.getBalance(_depositor1);
    await expect(
      klayBank
        .connect(_depositorSigner)
        .withdraw(signer[1].address, balance.toString() + '1000000')
    ).to.be.revertedWith('KlayBank: Insufficient Balance');
    expect(await klayBank.getBalance(_depositor1)).to.equal(balanceB4);
  });
});
