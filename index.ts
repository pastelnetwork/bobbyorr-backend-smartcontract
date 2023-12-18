import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import AWS from "aws-sdk";

import BobbyOrrDrop from "./contracts/BobbyOrrDrop/BobbyOrrDrop.json";

// AWS.config.update({
//   region: "us-east-1",
//   accessKeyId: process.env.AWS_ACCESSKEYID || "AWSAccessKeyID",
//   secretAccessKey: process.env.AWS_SECRETACCESSKEY || "AWSSecretAccessKey",
// });

const infuraUrl = process.env.INFURA_URL || "http://localhost:8545/";

console.log(infuraUrl);

const privateKey = process.env.PRIVATE_KEY || "MyPrivateKey";

const prisma = new PrismaClient();
// const ses = new AWS.SES();
// const ses = new AWS.SESV2();

const provider = new ethers.JsonRpcProvider(infuraUrl);
const signer = new ethers.Wallet(privateKey, provider);

export const setFCSM = async () => {
  let whiteListUsers = await prisma.user.findMany({
    where: {
      isFanClub: true,
    },
  });

  const whiteListUserLength = whiteListUsers.length;

  const myContract = new ethers.Contract(process.env.CONTRACT_ADDRESS || "Contract_Address", BobbyOrrDrop.abi, signer);
  console.log("setFCSM", whiteListUserLength);

  // for (let i = 0; i * 100 < whiteListUserLength; i += 100) {
  //   let array = [];
  //   for (let j = i * 100; j < Math.min(whiteListUserLength, (i + 1) * 100); j++) {
  //     array.push(whiteListUsers[j].id);
  //   }

  await myContract.setFanClubSmartmintUsers(
    whiteListUsers.map((user: any) => user.id),
    {
      gasLimit: 10000000,
    }
  );
  // }
};

export const setFCFSSM = async () => {
  let whiteListUsers = await prisma.user.findMany({
    where: {
      isBobby: true,
    },
  });

  const whiteListUserLength = whiteListUsers.length;

  const myContract = new ethers.Contract(process.env.CONTRACT_ADDRESS || "Contract_Address", BobbyOrrDrop.abi, signer);
  console.log("setFCFSSM", whiteListUserLength);

  // for (let i = 0; i * 100 < whiteListUserLength; i += 100) {
  //   let array = [];
  //   for (let j = i * 100; j < Math.min(whiteListUserLength, (i + 1) * 100); j++) {
  //     array.push(whiteListUsers[j].id);
  //   }

  await myContract.setWhiteListSmartmintUsers(
    whiteListUsers.map((user: any) => user.id),
    {
      gasLimit: 10000000,
    }
  );
  // }
};

export const setFCAddresses = async () => {
  let whiteListAddress = await prisma.bobbyOrrWhiteList.findMany({
    where: {
      isFanClub: true,
    },
  });
  let whiteListUserLength = whiteListAddress.length;

  const myContract = new ethers.Contract(process.env.CONTRACT_ADDRESS || "Contract_Address", BobbyOrrDrop.abi, signer);

  // for (let i = 0; i * 100 < whiteListUserLength; i += 100) {
  //   let array = [];
  //   for (let j = i * 100; j < Math.min(whiteListUserLength, (i + 1) * 100); j++) {
  //     array.push(whiteListAddress[j].address);
  //   }
  //   console.log("setFCAddresses", array);

  await myContract.setFanClubAddresses(
    whiteListAddress.map((user: any) => user.address),
    {
      gasLimit: 20000000,
    }
  );
  // }

  // await myContract.setFanClubAddresses(whiteListAddress.map((item) => item.id));
};

export const setFCFSAddresses = async () => {
  let whiteListUsers = await prisma.bobbyOrrWhiteList.findMany({});

  const myContract = new ethers.Contract(process.env.CONTRACT_ADDRESS || "Contract_Address", BobbyOrrDrop.abi, signer);

  let whiteListUserLength = whiteListUsers.length;

  // for (let i = 0; i * 100 < whiteListUserLength; i += 100) {
  //   let array = [];
  //   for (let j = i * 100; j < Math.min(whiteListUserLength, (i + 1) * 100); j++) {
  //     array.push(whiteListUsers[j].address);
  //   }
  //   console.log("setFCFSAddresses", array);

  await myContract.setWhiteListAddresses(
    whiteListUsers.map((user) => user.address),
    {
      gasLimit: 20000000,
    }
  );
  // }
  // await myContract.setWhiteListAddresses(whiteListUsers.map((item) => item.id));
};

export const setup = async () => {
  try {
    await setFCSM();
    await setFCFSSM();
    await setFCAddresses();
    await setFCFSAddresses();
  } catch (error) {
    console.log(error);
  }
};

setup();
