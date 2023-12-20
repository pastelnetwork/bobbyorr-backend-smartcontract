import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import AWS from "aws-sdk";

import BobbyOrrDrop from "./contracts/BobbyOrrDrop/BobbyOrrDrop.json";

const infuraUrl = process.env.INFURA_URL || "http://localhost:8545/";

console.log(infuraUrl);

const privateKey = process.env.PRIVATE_KEY || "MyPrivateKey";

const prisma = new PrismaClient();
// const ses = new AWS.SESV2();

const provider = new ethers.JsonRpcProvider(infuraUrl);
const signer = new ethers.Wallet(privateKey, provider);

export const sendToFanClubUsers = async () => {
  AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESSKEYID || "AWSAccessKeyID",
    secretAccessKey: process.env.AWS_SECRETACCESSKEY || "AWSSecretAccessKey",
  });
  const ses = new AWS.SES();

  const fanClubUsers = await prisma.user.findMany({
    where: {
      isFanClub: true,
    },
  });

  console.log("Number of fanClubUsers", fanClubUsers.length);

  let params = {
    Destination: {
      // ToAddresses: fanClubUsers.map((user) => user.email)
      ToAddresses: ["anthony@pastel.network"],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<strong>You've been selected as a Fan Club user, giving you early access to purchase one of the first Orr 1,444 Deck NFTs.</strong><br />
          To purchase your NFT, visit our site and login with the details you used to register. Then, simply follow the minting steps and score your first Orr digital trading card!<br />
          Note: As a Fan Club user, you must purchase before December 20 17:59:59 UTC in order to claim your guaranteed spot. While you can still purchase during the Private and Public sales, it will not be guaranteed!<br />
          Need help? Please see <a href="https://www.youtube.com/watch?v=eN43znkOhQ0&amp;feature=youtu.be">here</a> for a  video tutorial explaining how to use a MetaMask wallet so you can snag a piece of history.<br />
          If you have any questions, please reply to this email and we'll be happy to assist you.<br />
          Sincerely,<br />
          <a href="https://www.bobbyorr.io/">The Bobby Orr Collection Team</a>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `You've been selected! Purchase your Orr 1,444 Deck Collectible Today!`,
      },
    },
    Source: "Hello@BobbyOrr.io",
  };

  ses.sendEmail(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });
};

export const sendToWhiteListUsers = async () => {
  AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESSKEYID || "AWSAccessKeyID",
    secretAccessKey: process.env.AWS_SECRETACCESSKEY || "AWSSecretAccessKey",
  });
  const ses = new AWS.SES();

  const whiteListUsers = await prisma.user.findMany({
    where: {
      isBobby: true,
    },
  });

  console.log("Number of whiteListUsers", whiteListUsers.length);

  let params = {
    Destination: {
      // ToAddresses: whiteListUsers.map((user) => user.email)
      ToAddresses: ["taylor.lawrence@pastel.network"],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<strong>You've been selected as a Fan Club user, giving you early access to purchase one of the first Orr 1,444 Deck NFTs.</strong><br />
          To purchase your NFT, visit our site and login with the details you used to register. Then, simply follow the minting steps and score your first Orr digital trading card!<br />
          Note: As a Fan Club user, you must purchase before December 20 17:59:59 UTC in order to claim your guaranteed spot. While you can still purchase during the Private and Public sales, it will not be guaranteed!<br />
          Need help? Please see <a href="https://www.youtube.com/watch?v=eN43znkOhQ0&amp;feature=youtu.be">here</a> for a  video tutorial explaining how to use a MetaMask wallet so you can snag a piece of history.<br />
          If you have any questions, please reply to this email and we'll be happy to assist you.<br />
          Sincerely,<br />
          <a href="https://www.bobbyorr.io/">The Bobby Orr Collection Team</a>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `You've been selected! Purchase your Orr 1,444 Deck Collectible Today!`,
      },
    },
    Source: "Hello@BobbyOrr.io",
  };

  ses.sendEmail(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });
};

export const setFCSM = async () => {
  let whiteListUsers = await prisma.user.findMany({
    where: {
      isFanClub: true,
    },
  });

  const whiteListUserLength = whiteListUsers.length;

  const myContract = new ethers.Contract(process.env.CONTRACT_ADDRESS || "Contract_Address", BobbyOrrDrop.abi, signer);
  console.log(
    "setFCSM",
    whiteListUserLength,
    JSON.stringify(whiteListUsers.map((user, index) => ({ index, id: user.id })))
  );

  for (let i = 5; i * 100 < whiteListUserLength; i += 1) {
    let array = [];
    for (let j = i * 100; j < Math.min(whiteListUserLength, (i + 1) * 100); j++) {
      array.push(whiteListUsers[j].id);
    }

    const tx = await myContract.setFanClubSmartmintUsers(array);

    const response = await tx.wait();
    console.log("response", response);
  }
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
  console.log(
    "setFCSM",
    whiteListUserLength,
    JSON.stringify(whiteListAddress.map((user, index) => ({ index, address: user.address })))
  );

  for (let i = 1; i * 100 < whiteListUserLength; i += 1) {
    let array = [];
    for (let j = i * 100; j < Math.min(whiteListUserLength, (i + 1) * 100); j++) {
      array.push(whiteListAddress[j].address);
    }
    console.log("setFCAddresses", array);

    const tx = await myContract.setFanClubAddresses(array);

    const response = await tx.wait();
    console.log("response", response);
  }

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
    // await setFCAddresses();
  } catch (error) {
    console.log(error);
  }
};
//
// setup();
