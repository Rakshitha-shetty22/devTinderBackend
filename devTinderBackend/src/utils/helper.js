function validateEditData (req, res) {
    const allowedFields = ["firstName", "lastName", "gender", "skills", "photoUrl"];

    const isUpdatedAllowed = Object.keys(req.body).every((fields)=>allowedFields.includes(fields));

    if(!isUpdatedAllowed) 
        throw new Error("update is not allowed....")
   
    return true;
}

module.exports = {validateEditData}
