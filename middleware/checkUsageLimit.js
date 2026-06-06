import Usage from "../models/usageSchema.js";
const checkUsageLimit =
async(req, res, next) => {

    try {

        const clerkId =
            req.auth().userId;



        let userUsage =
            await Usage.findOne({
                clerkId
            });



        // FIRST USER

        if(!userUsage){

            userUsage =
                await Usage.create({
                    clerkId
                });
        }



        // RESET AFTER 24 HOURS

        if(Date.now() > userUsage.messageResetAt){

            userUsage.dailyMessageCount = 0;

            userUsage.messageResetAt =
                Date.now() +
                24 * 60 * 60 * 1000;

            await userUsage.save();
        }



        // LIMIT CHECK

        if(

            userUsage.dailyMessageCount >=
            userUsage.dailyMessageLimit

        ){

            return res.status(403).json({

                success: false,

                message:
                    "Daily message limit exceeded"

            });
        }



        req.userUsage = userUsage;

        next();

    } catch(error){

        console.log(error);

        res.status(500).json({
            error: "Usage middleware failed"
        });
    }
};

export default checkUsageLimit;