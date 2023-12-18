import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import AWS from "aws-sdk";

import BobbyOrrDrop from "./contracts/BobbyOrrDrop/BobbyOrrDrop.json";

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESSKEYID || "AWSAccessKeyID",
  secretAccessKey: process.env.AWS_SECRETACCESSKEY || "AWSSecretAccessKey",
});

const infuraUrl = process.env.INFURA_URL || "http://localhost:8545/";
const privateKey = process.env.PRIVATE_KEY || "MyPrivateKey";

const prisma = new PrismaClient();
const ses = new AWS.SES();
// const ses = new AWS.SESV2();

const provider = new ethers.JsonRpcProvider(infuraUrl);
const signer = new ethers.Wallet(privateKey, provider);

export const handler = async () => {
  let whiteListUsers = await prisma.user.findMany({
    where: {
      isBobby: true,
    },
  });

  const whiteListUserLength = whiteListUsers.length;

  const myContract = new ethers.Contract(process.env.CONTRACT_ADDRESS || "Contract_Address", BobbyOrrDrop.abi, signer);

  myContract.setWhiteListSmartmint(whiteListUsers.map((item) => item.id));

  const minLength = Math.min(2, whiteListUserLength);

  // console.log("minLength", minLength);

  // let fanClubUsers = [];

  // for (let i = 0; i < minLength; i++) {
  //   const randomUserIndex = Math.floor(Math.random() * 10000) % (whiteListUserLength - i);

  //   fanClubUsers.push(whiteListUsers[randomUserIndex]);
  //   let left = whiteListUsers.slice(0, randomUserIndex),
  //     right = whiteListUsers.slice(randomUserIndex + 1, whiteListUsers.length);

  //   whiteListUsers = [...left, ...right];
  // }

  // console.log("length:", fanClubUsers.length);

  // for (let i = 0; i < fanClubUsers.length; i++) {
  //   try {
  //     await prisma.user.update({
  //       where: {
  //         id: fanClubUsers[i].id,
  //       },
  //       data: {
  //         isFanClub: true,
  //       },
  //     });

  //     const params = {
  //       Source: "hello@bobbyorr.io",
  //       Destination: {
  //         ToAddresses: [fanClubUsers[i].email],
  //       },
  //       Message: {
  //         Subject: {
  //           Data: `Congratulations! You are now a FanClub User.`,
  //         },
  //         Body: {
  //           Text: {
  //             Data: `Hi, how are you doing today.`,
  //           },
  //         },
  //       },
  //     };

  //     ses.sendEmail(params, (err: AWS.AWSError, data: AWS.SES.SendEmailResponse) => {
  //       if (err) {
  //         console.log("message", err.message);
  //       }
  //       if (data) {
  //         // console.log("Email ID:", i, data.MessageId);
  //       }
  //     });
  //   } catch (error) {
  //     console.log("message", error);
  //   }
  // }

  // myContract.setAllowListFanClubUsers(fanClubUsers.map((item) => item.id));
  // myContract.setStage(1, ethers.parseEther("0.004"));
};
