# klaytn_Hardhat_Example
클레이튼은 이더리움과 달리 고정 가스비 모델을 채택하고 있습니다. 따라서 개발자가 트랜잭션을 생성할 때 이더리움과 달리 가스를 고정적으로 설정해줘야합니다.  

이 저장소에서는 Hardhat과 ethers.js를 사용하여 klaytn의 스마트컨트랙트를 작성 및 컴파일, 배포, 테스트를 하는 방법을 안내합니다. 
## 설치 방법
1. 저장소 Clone:

```shell
git clone https://github.com/thyoondev/klaytn_Hardhat_Example.git
```

2. NPM 패키지 설치:

```shell
cd Hardhat_Klaytn_Example
yarn
```
3. Hardhat Config 설정:
```shell
const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    klaytn: {
      url: process.env.KLAYTN_URL || "",
      gasPrice: 250000000000,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

```

4. .env 파일 생성:

```shell
KLAYTN_URL='https://api.baobab.klaytn.net:8651'
PRIVATE_KEY=카이카스 지갑의 개인키를 넣어주세요.

```

5. 컨트랙트 컴파일:

```shell
yarn hardhat compile
```

6. Hardhat Node 실행:

```shell
yarn hardhat node
```

7. 배포 실행:

```shell
yarn hardhat run scripts/deploy.ts --network localhost
```

8. 테스트 실행:

```shell
yarn hardhat test test/index.ts --network localhost
```

# 참고 자료
- [하드햇(Hardhat)에서 클레이튼(Klaytn) 배포하기](https://velog.io/@thyoondev/%ED%95%98%EB%93%9C%ED%96%87Hardhat%EC%97%90%EC%84%9C-%ED%81%B4%EB%A0%88%EC%9D%B4%ED%8A%BCKlaytn-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0)
