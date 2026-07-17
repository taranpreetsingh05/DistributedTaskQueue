async  function sendEmail(payload:unknown){
    console.log("Sending email...");
    throw new Error("Testing retries");
    // console.log("email service");
    // console.log(payload);
}
export default sendEmail;