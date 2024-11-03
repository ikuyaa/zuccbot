import {LogHelper} from "../../../helpers/Helpers";

module.exports = (client: any, handler: any) => {
    LogHelper.log(`✔️  ${client.user.username} is logged in.`);
};