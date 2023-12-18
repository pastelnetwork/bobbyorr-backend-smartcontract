"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_1 = require("@prisma/client");
const ethers_1 = require("ethers");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const BobbyOrrDrop_json_1 = __importDefault(require("./contracts/BobbyOrrDrop/BobbyOrrDrop.json"));
aws_sdk_1.default.config.update({
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESSKEYID || "AWSAccessKeyID",
    secretAccessKey: process.env.AWS_SECRETACCESSKEY || "AWSSecretAccessKey",
});
const infuraUrl = process.env.INFURA_URL || "http://localhost:8545/";
const privateKey = process.env.PRIVATE_KEY || "MyPrivateKey";
const prisma = new client_1.PrismaClient();
const ses = new aws_sdk_1.default.SES();
// const ses = new AWS.SESV2();
const provider = new ethers_1.ethers.JsonRpcProvider(infuraUrl);
const signer = new ethers_1.ethers.Wallet(privateKey, provider);
const handler = () => __awaiter(void 0, void 0, void 0, function* () {
    let whiteListUsers = yield prisma.user.findMany({
        where: {
            isBobby: true,
        },
    });
    const whiteListUserLength = whiteListUsers.length;
    const minLength = Math.min(2, whiteListUserLength);
    console.log("minLength", minLength);
    let fanClubUsers = [];
    for (let i = 0; i < minLength; i++) {
        const randomUserIndex = Math.floor(Math.random() * 10000) % (whiteListUserLength - i);
        fanClubUsers.push(whiteListUsers[randomUserIndex]);
        let left = whiteListUsers.slice(0, randomUserIndex), right = whiteListUsers.slice(randomUserIndex + 1, whiteListUsers.length);
        whiteListUsers = [...left, ...right];
    }
    console.log("length:", fanClubUsers.length);
    for (let i = 0; i < fanClubUsers.length; i++) {
        try {
            yield prisma.user.update({
                where: {
                    id: fanClubUsers[i].id,
                },
                data: {
                    isFanClub: true,
                },
            });
            const params = {
                Source: "hello@bobbyorr.io",
                Destination: {
                    ToAddresses: [fanClubUsers[i].email],
                },
                Message: {
                    Subject: {
                        Data: `Congratulations! You are now a FanClub User.`,
                    },
                    Body: {
                        Text: {
                            Data: `Hi, how are you doing today.`,
                        },
                    },
                },
            };
            ses.sendEmail(params, (err, data) => {
                if (err) {
                    console.log("message", err.message);
                }
                if (data) {
                    console.log("Email ID:", i, data.MessageId);
                }
            });
        }
        catch (error) {
            console.log("message", error);
        }
    }
    const myContract = new ethers_1.ethers.Contract(process.env.CONTRACT_ADDRESS || "Contract_Address", BobbyOrrDrop_json_1.default.abi, signer);
    myContract.setAllowListFanClubUsers(fanClubUsers.map((item) => item.id));
    // myContract.setStage(1, ethers.parseEther("0.004"));
});
exports.handler = handler;
//# sourceMappingURL=index.js.map