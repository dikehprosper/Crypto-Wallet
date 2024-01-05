import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({
  email,
  emailType,
  userId,
  fullname,
}: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    const randomNumbers = Array.from(
      { length: 4 },
      () => Math.floor(Math.random() * 9) + 1
    );
    const randomNumbersString = randomNumbers.join("");

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 86400000,
      });
    }

    if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 7200000,
      });
    }

    if (emailType === "SEND") {
      await User.findByIdAndUpdate(userId, {
        faToken: randomNumbersString,
        faTokenExpiry: Date.now() + 7200000,
      });
    }

    const adminEmail = process.env.EMAIL!;
    const adminEmailKey = process.env.EMAIL_KEY!;

    var transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: adminEmail,
        pass: adminEmailKey,
      },
    });

    const mailOptions = {
      from: "contact@meta-chains.org",
      to: email,
      subject: (() => {
        if (emailType === "VERIFY") {
          return "Verify your email";
        } else if (emailType === "RESET") {
          return "Reset your password";
        } else if (emailType === "WELCOME") {
          return "Welcome to Meta-chains";
        } else {
          return "2FA Password"; // You should define the subject for other cases
        }
      })(),
      html: (() => {
        if (emailType === "VERIFY") {
          return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            text-align: center;
            width: 100%;
            height: 100%;
            background-color: #f0f0f0;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .container {
            text-align: center;
            width: 80%;
            height: auto;
            margin: 35px auto;
        }

        .image {
            text-align: center;
            margin: 35px auto;
        }

        .content {
            width: 80%;
            height: 420px;
            background-color: white;
            border-top: 3px solid #FFDA39;
            margin: 0px auto;
            padding: 0px 38px;
        }

        h3 {
            text-align: center;
            color: black;
            font-size: 24px;
        }

        p {
            font-size: 15px;
            font-family: Arial, sans-serif;
            margin: 30px 0;
            color: black;
        }

          .reset-link {
            font-weight: bold;
            color: white;
            text-decoration: none;
            width: 100%;
             display: flex;
             justify-content: center;
           
        }



         .reset-link a {
            text-decoration: none;
            color: white;
            font-weight: bold;
              margin: 0px auto;
               padding: 17px 37px;
               border-radius: 4px;
                 background: black;
                 white-space: nowrap
        }
        .url-link {
            color: black;
            font-size: 15px;
            line-height: 23px;
        }

        .expiration {
            color: #afafaf;
            font-size: 15px;
            color: black;
        }

        .footer {
             text-align: center;
            font-size: 12px;
            font-family: Arial, sans-serif;
            margin: 10px 0;
            color: black;
        }

          .footer1 {
            text-align: center;
            font-size: 12px;
            font-family: Arial, sans-serif;
            color: black;
            text-decoration: none;
            margin-top: 0px; /* Space added here */
        }

        .footer-links {
             text-align: center;
            font-size: 12px;
            font-family: Arial, sans-serif;
            color: black;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="image">
            <img src="https://firebasestorage.googleapis.com/v0/b/my-app-a50eb.appspot.com/o/meta%20(1).png?alt=media&token=e642c545-3389-47c1-ac45-c5bc66aa974a" alt="Firebase Image" width="200" height="150">
        </div>

        <div class="content">
            <h3>Hello ${fullname}</h3>
            <p>To verify your email, please click on the button below</p>
            <div class="reset-link">
                <a href="${
                  process.env.DOMAIN
                }/verifyemail?token=${hashedToken}">VERIFY YOUR EMAIL</a>
            </div>


               <div class="reset-link">

                <a href="${process.env
                  .DOMAIN!}/verifyemail?token=${hashedToken}">
                              <div class="reset-link-inner">
                             VERIFY YOUR EMAIL
                                          </div>
                              </a>

               </div>



            <p class="url-link">
                If you're having trouble, try copying and pasting the following URL into your browser:
                <a href="${
                  process.env.DOMAIN
                }/verifyemail?token=${hashedToken}">"${
            process.env.DOMAIN
          }/verifyemail?token=${hashedToken}"</a>
            </p>
            <p class="expiration">
                This link will expire in 24 hours.
            </p>
        </div>
    </div>
    <p class="footer1">© Meta-chains | Address here</p>
    <p class="footer-links">
        <a href="" style="color: black;">View Web Version</a> |
        <a href="" style="color: black;">Email Preferences</a> |
        <a href="" style="color: black;">Privacy Policy</a>
    </p>
    <p class="footer">
        If you have any questions please contact us
        <a href="" style="color: black;">hello@meta-chains.com</a>
    </p>
    <p class="footer">
        <a href="mailto@meta-chains.com" style="color: black;">Unsubscribe</a> from our mailing lists
    </p>
</body>
</html>
 `;
        } else if (emailType === "RESET") {
          return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            text-align: center;
            width: 100%;
            height: 100%;
            background-color: #f0f0f0;
            font-family: Arial, sans-serif;
        }

        .container {
            text-align: center;
            width: 90%;
            height: auto;
            align-self: center;
            margin: 0px auto;
        }

        .image {
            text-align: center;
            align-self: center;
            margin: 35px auto;
        }

        .content {
            width: 80%;
            height: 420px;
            background-color: white;
            border-top: 3px solid #FFDA39;
            align-self: center;
            margin: 35px auto;
        }

        h3 {
            text-align: center;
            color: black;
            font-size: 24px;
        }

        p {
            font-size: 18px;
            font-family: Arial, sans-serif;
            color: #999999;
        }

              .reset-link {
            font-weight: bold;
            color: white;
            text-decoration: none;
            width: 100%;
             display: flex;
             justify-content: center;
           
        }



         .reset-link a {
            text-decoration: none;
            color: white;
            font-weight: bold;
              margin: 0px auto;
               padding: 17px 37px;
               border-radius: 4px;
                 background: black;
                 white-space: nowrap
        }
        .url {
            color: black;
            font-size: 15px;
            line-height: 23px;
            margin: 10px 15px;
        }

        .url > p {
          color: blue;
          text-decoration: none;
        }
     

        .expiration {
            color: #afafaf;
            font-size: 15px;
            color: black;
            margin: 10px 15px;
        }

        .footer {
                 text-align: center;
            font-size: 12px;
            font-family: Arial, sans-serif;
            margin: 10px 15px;
            color: black;
            text-decoration: none;
        }

        .footer1 {
            text-align: center;
            font-size: 12px;
            font-family: Arial, sans-serif;
            color: black;
            text-decoration: none;
            margin-top: 30px; /* Space added here */
        }

        .footer-links {
                 text-align: center;
            font-size: 12px;
            font-family: Arial, sans-serif;
            color: black;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="image">
            <img src="https://firebasestorage.googleapis.com/v0/b/my-app-a50eb.appspot.com/o/meta%20(1).png?alt=media&token=e642c545-3389-47c1-ac45-c5bc66aa974a" alt="Firebase Image" width="200" height="150">
        </div>

        <div class="content">
            <h3>Hello ${fullname}</h3>
            <p>Forgot your password?</p>
            <p>To reset your password, please click on the button below</p>
          
     <div class="reset-link">

                <a href="${process.env
                  .DOMAIN!}/resetpassword?token=${hashedToken}">
                              <div class="reset-link-inner">
                              RESET YOUR PASSWORD
                                          </div>
                              </a>

               </div>



            <p class="url">
                If you're having trouble, try copying and pasting the following URL into your browser:
                <p>${process.env.DOMAIN}/resetpassword?token=${hashedToken}</p>
            </p>
            <p class="expiration">
                This link will expire in 2 hours.
            </p>
        </div>
    </div>
    <p class="footer1">© Meta-chains | Address here</p>
    <p class="footer-links">
        <a href="" style="color: black;">View Web Version</a> |
        <a href="" style="color: black;">Email Preferences</a> |
        <a href="" style="color: black;">Privacy Policy</a>
    </p>
    <p class="footer">
        If you have any questions, please contact us
        <a href="" style="color: black;">hello@meta-chains.com</a>
    </p>
    <p class="footer">
        <a href="mailto@meta-chains.com" style="color: black;">Unsubscribe</a> from our mailing lists
    </p>
</body>
</html>

          `;
        } else if (emailType === "WELCOME") {
          return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            text-align: center;
            width: 100%;
            height: 100%;
            background-color: #f0f0f0;
            font-family: Arial, sans-serif;
            padding: 25px auto;
        }

        .container {
            text-align: center;
            width: 80%;
            height: auto;
            align-self: center;
            margin: 0px auto;
        }

        .image {
            text-align: center;
            align-self: center;
            margin: 35px auto;
        }

        .content {
            width: 90%;
            height: auto;
            background-color: white;
            border-top: 3px solid #FFDA39;
            align-self: center;
            margin: 35px auto;
            padding: 20px auto;
            word-break: break-word;
        }

        h3 {
            text-align: center;
            color: black;
            font-size: 24px;
        }

        p {
            font-size: 15px;
            font-family: Arial, sans-serif;
            margin: 15px 15px;
            color: black;
            word-wrap: break-word;
            width: 95%;
        }

        p:last-child {
            margin-bottom: 30px;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            font-family: Arial, sans-serif;
            color: black;
            text-decoration: none;
            margin-top: 20px; /* Space added here */
        }

         .footer1 {
            text-align: center;
            font-size: 12px;
            font-family: Arial, sans-serif;
            color: black;
            text-decoration: none;
            margin-top: 40px; /* Space added here */
        }

        .footer-links {
          text-align: center;
            font-size: 12px;
            font-family: Arial, sans-serif;
            color: black;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="image">
            <img src="https://firebasestorage.googleapis.com/v0/b/my-app-a50eb.appspot.com/o/meta%20(1).png?alt=media&token=e642c545-3389-47c1-ac45-c5bc66aa974a" alt="Firebase Image" width="200" height="150">
        </div>

        <div class="content">
            <h3>Welcome to Meta-chains</h3>
            <p>Getting Started With Meta-chains</p>
            <p>Meta-chains was founded in 2001 by Meta-traders.org with the aim of making investing accessible for everyone. Our goals since day one have been to create a digital market environment where people can invest and earn regardless of their schedules. Trades will be carried out even in their absence, reducing our investors' burden.</p>
            <p>Now, 20 years later, and with more than 1,000 team members and over 30 thousand users, we're one of the fastest-growing investment companies in Canada. With our service license, state-of-the-art security, and streamlined user experience, we make it possible for both first-time investors and seasoned experts to invest in what they believe in.</p>
            <p>Our user-friendly and enhanced trading software platform empowers you to invest in the stocks, cryptocurrencies, and other platforms you want — with any amount of money.</p>
            <p>Meta-chains aspires to leverage its expertise and strong capital position to own and operate a selection of retail, consumer products, and wholesale businesses.</p>
        </div>
    </div>
    <p class="footer1">© Meta-chains | Address here</p>
    <p class="footer-links">
        <a href="" style="color: black;">View Web Version</a> |
        <a href="" style="color: black;">Email Preferences</a> |
        <a href="" style="color: black;">Privacy Policy</a>
    </p>
    <p class="footer">
        If you have any questions, please contact us
        <a href="" style="color: black;">hello@meta-chains.com</a>
    </p>
    <p class="footer">
        <a href="mailto@meta-chains.com" style="color: black;">Unsubscribe</a> from our mailing lists
    </p>
</body>
</html>`;
        } else {
          return `
<!DOCTYPE html>
<html>
<body
    style="
      text-align: center;
      width: 100%;
      padding: 20px 0px;
            background-color: #f0f0f0;
      height: 100%;
      font-family: Arial, sans-serif;
      justify-content: center;
    
    "
  >
    <div
      style="
        text-align: center;
        width: 80%;
        height: 200px;
        align-self: center;
        margin: 10px auto;
      "
    >
      <img src="https://firebasestorage.googleapis.com/v0/b/my-app-a50eb.appspot.com/o/meta%20(1).png?alt=media&token=e642c545-3389-47c1-ac45-c5bc66aa974a" alt="Firebase Image" width="200" height="150">
    </div>

    <div
      style="
        text-align: center;
        width: 80%;
        height: 420px;
        background-color: white;
        border-top: 3px solid #FFDA39;
        align-self: center;
        margin: 0px auto;
      "
    >
      <h3 style="text-align: center; color: black; font-size: 24px;">
        TWO FACTOR AUTHENTICATION
      </h3>
    

      <div style="margin-top: 30px; height: auto;">
        <div
          style="
            padding: 17px 37px;
            border-radius: 25px;
            font-weight: bold;
            color: black;
            text-decoration: none;
          "
        >
         Authorize login into your account
        </div>

          <div
          style="
          background-color: #FFDA39;
            padding: 17px 10px;
            border-radius: 25px;
            font-weight: bold;
            color: black;
            letter-spacing: 20px;
            font-size: 28px;
            text-decoration: none;
            max-width: 450px;
            margin: 0px auto
          "
        >
         ${randomNumbersString}
        </div>
 
        <p
          style="
            color: #afafaf;
            margin-top: 30px;
            font-size: 15px;
            color: black;
            opacity: 0.7
          "
        >
        This is your requested account One Time Password (OTP) code to log in with your email address (<a href="mailto:${email}">${email}</a>).This code will expire in 2 hours.
        </p>
      </div>
    </div>
    <p
      style="
        font-size: 12px;
        font-family: Arial, sans-serif;
        margin: 40px 0px 10px 0px;
        color: black;
        text-decoration: none;
      "
    >
      © Meta-chains | Address here
    </p>
    <p
      style="
        font-size: 12px;
        font-family: Arial, sans-serif;
        margin: 3px 15px;
        color: black;
      "
    >
      <a href="" style="color: black;">View Web Version </a> |
      <a href="" style="color: black;">Email Preferences</a> |
      <a href="" style="color: black;">Privacy Policy</a>
    </p>
    <p
      style="
        font-size: 12px;
        font-family: Arial, sans-serif;
        margin: 20px 15px 0px 15px;
        color: black;
      "
    >
      If you have any questions please contact us
      <a href="" style="color: black;">hello@meta-chains.com</a>
    </p>
    <p
      style="
        font-size: 12px;
        font-family: Arial, sans-serif;
        margin: 8px 15px;
        color: black;
        
      "
    >
      <a href="mailto@meta-chains.com" style="color: black;">Unsubscribe </a>
      from our mailing lists
    </p>
  </body>
</html>
          `;
        }
      })(),
    };
    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error) {
    throw new Error(error.message);
  }
};
