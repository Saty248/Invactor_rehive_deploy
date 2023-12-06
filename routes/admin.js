const express=require("express")
const router =express.Router();
const {working,rehiveActivation,rehiveDeactivation,deposit_omnibus,webHooks,PostwebHooks,isWithDraw,quote}=require("../controllers/admin")


router.route("/").get(working)

router.route("/activate").post(rehiveActivation)

router.route("/deactivate").post(rehiveDeactivation)
router.route("/getwebHooks").get(webHooks)
router.route("/PostwebHooks").post(PostwebHooks)

// deposit endpoint functions.
//Deposit funds into omnibus bank account route
router.route("/deposit").get(deposit_omnibus)



//Deposit funds into segregated bank account route

router.route("/isWithDraw").post(isWithDraw)

router.route("/quote").post(quote)


//681720d2-0c84-4471-a283-06fab7076091

module.exports=router