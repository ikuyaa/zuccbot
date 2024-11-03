import Time from '../Time/Time';

export default class MessageHelper {
    static DeleteTimed(interaction: any, time: number, notReply: boolean = false): NodeJS.Timeout | void {

        if(!interaction)
            return;

        return setTimeout(async () => {
            try {
                notReply? await interaction.delete() : await interaction.deleteReply();
            } catch (err) {
                //Message was deleted already by the user, probably. Just return.
                return;
            }
        }, time);
    }
}