var globals = require("./config/constant");
var exports = module.exports = {};


exports.forgot_password = function(result) {
        const template = `<!DOCTYPE html>
  <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Forgot Password</title>
  
          <style type="text/css">
              @media only screen and (max-width: 480px) {
              body,
              table,
              td,
              p,
              a,
              li,
              blockquote {
                  -webkit-text-size-adjust: none !important
              }
              body {
                  width: 100% !important;
                  min-width: 100% !important
              }
              td[id=bodyCell] {
                  padding: 10px !important
              }
              table.kmMobileHide {
                  display: none !important
              }
              table[class=kmTextContentContainer] {
                  width: 100% !important
              }
              table[class=kmBoxedTextContentContainer] {
                  width: 100% !important
              }
              td[class=kmImageContent] {
                  padding-left: 0 !important;
                  padding-right: 0 !important
              }
              img[class=kmImage],
              img.kmImage {
                  width: 100% !important
              }
              td.kmMobileStretch {
                  padding-left: 0 !important;
                  padding-right: 0 !important
              }
              table[class=kmSplitContentLeftContentContainer],
              table.kmSplitContentLeftContentContainer,
              table[class=kmSplitContentRightContentContainer],
              table.kmSplitContentRightContentContainer,
              table[class=kmColumnContainer],
              td[class=kmVerticalButtonBarContentOuter] table[class=kmButtonBarContent],
              td[class=kmVerticalButtonCollectionContentOuter] table[class=kmButtonCollectionContent],
              table[class=kmVerticalButton],
              table[class=kmVerticalButtonContent] {
                  width: 100% !important
              }
              td[class=kmButtonCollectionInner] {
                  padding-left: 9px !important;
                  padding-right: 9px !important;
                  padding-top: 9px !important;
                  padding-bottom: 0 !important;
                  background-color: transparent !important
              }
              td[class=kmVerticalButtonIconContent],
              td[class=kmVerticalButtonTextContent],
              td[class=kmVerticalButtonContentOuter] {
                  padding-left: 0 !important;
                  padding-right: 0 !important;
                  padding-bottom: 9px !important
              }
              table[class=kmSplitContentLeftContentContainer] td[class=kmTextContent],
              table[class=kmSplitContentRightContentContainer] td[class=kmTextContent],
              table[class=kmColumnContainer] td[class=kmTextContent],
              table[class=kmSplitContentLeftContentContainer] td[class=kmImageContent],
              table[class=kmSplitContentRightContentContainer] td[class=kmImageContent],
              table.kmSplitContentLeftContentContainer td.kmImageContent,
              table.kmSplitContentRightContentContainer td.kmImageContent {
                  padding-top: 9px !important
              }
              td[class="rowContainer kmFloatLeft"],
              td.rowContainer.kmFloatLeft,
              td[class="rowContainer kmFloatLeft firstColumn"],
              td.rowContainer.kmFloatLeft.firstColumn,
              td[class="rowContainer kmFloatLeft lastColumn"],
              td.rowContainer.kmFloatLeft.lastColumn {
                  float: left;
                  clear: both;
                  width: 100% !important
              }
              table[class=templateContainer],
              table[class="templateContainer brandingContainer"],
              div[class=templateContainer],
              div[class="templateContainer brandingContainer"],
              table[class=templateRow] {
                  max-width: 600px !important;
                  width: 100% !important
              }
              h1 {
                  font-size: 24px !important;
                  line-height: 130% !important
              }
              h2 {
                  font-size: 20px !important;
                  line-height: 130% !important
              }
              h3 {
                  font-size: 18px !important;
                  line-height: 130% !important
              }
              h4 {
                  font-size: 16px !important;
                  line-height: 130% !important
              }
              td[class=kmTextContent] {
                  font-size: 14px !important;
                  line-height: 130% !important
              }
              td[class=kmTextBlockInner] td[class=kmTextContent] {
                  padding-right: 18px !important;
                  padding-left: 18px !important
              }
              table[class="kmTableBlock kmTableMobile"] td[class=kmTableBlockInner] {
                  padding-left: 9px !important;
                  padding-right: 9px !important
              }
              table[class="kmTableBlock kmTableMobile"] td[class=kmTableBlockInner] [class=kmTextContent] {
                  font-size: 14px !important;
                  line-height: 130% !important;
                  padding-left: 4px !important;
                  padding-right: 4px !important
              }
              }
          </style>
          <!--[if mso]>
          <style>
            
            .templateContainer {
              border: 1px none #aaaaaa;
              background-color: #FFFFFF;
              
            }
            #brandingContainer {
              background-color: transparent !important;
              border: 0;
            }
            
            
            .templateContainerInner {
              padding: 0px;
            }
            
          </style>
          <![endif]-->
      </head>
        <body style="margin:0;padding:0;background-color:#FFF">
          <center>
            <table align="center" border="0" cellpadding="0" cellspacing="0" id="bodyTable" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding:0;background-color:#FFF;height:100%;margin:0;width:100%">
              <tbody>
                <tr>
                  <td align="center" id="bodyCell" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding-top:50px;padding-left:20px;padding-bottom:20px;padding-right:20px;border-top:0;height:100%;margin:0;width:100%">
                    <!--[if !mso]><!-->
                    <div class="templateContainer" style="border:1px none #aaa;background-color:#FFF;display: table; width:600px">
                      <div class="templateContainerInner" style="padding:0">
                        <!--<![endif]-->
                  <!--[if mso]>
                    <table border="0" cellpadding="0" cellspacing="0" class="templateContainer"  width="600" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                    <tbody>
                      <tr>
                        <td class="templateContainerInner" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                          <![endif]-->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                            <tr>
                              <td align="center" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                <table border="0" cellpadding="0" cellspacing="0" class="templateRow" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                  <tbody>
                                    <tr>
                                      <td class="rowContainer kmFloatLeft" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                        <table border="0" cellpadding="0" cellspacing="0" class="kmTextBlock" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                          <tbody class="kmTextBlockOuter">
                                            <tr>
                                              <td class="kmTextBlockInner" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                                                <table align="left" border="0" cellpadding="0" cellspacing="0" class="kmTextContentContainer" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                                  <tbody>
                                                    <tr>
                                                      <td class="kmTextContent" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;color:#000;font-family:Helvetica, Arial;font-size:14px;line-height:150%;text-align:left;padding-top:9px;padding-bottom:9px;padding-left:18px;padding-right:18px;">
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        
                                        <table border="0" cellpadding="0" cellspacing="0" class="kmTextBlock" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                          <tbody class="kmTextBlockOuter">
                                            <tr>
                                              <td class="kmTextBlockInner" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                                                <table align="left" border="0" cellpadding="0" cellspacing="0" class="kmTextContentContainer" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                                  <tbody>
                                                    <tr>
                                                      <td class="kmTextContent" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;color:#000;font-family:Helvetica, Arial;font-size:14px;line-height:150%;text-align:left;padding-top:9px;padding-bottom:9px;padding-left:18px;padding-right:18px;">
                                                        <span style="color:#000000;"></span>
                                                        <!-- Your Content As below -->
                                                        <p style="margin:0;padding-bottom:1em;text-align: justify;"><span style="font-size:16px;"><span style="color: rgb(0, 0, 0);"><span style="font-family: arial,helvetica,sans-serif;"></span></span></span></p>
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Dear <strong>${result.name}</strong>,</span></span></p>
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Please use below link to change your password!</span></span></p>
                                                        <p style="margin:0;padding-bottom:1em"> </p>
                                                        
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Click Here To Change Your Password:&nbsp;&nbsp;&nbsp;<a href="${result.url}" target="_blank" style="word-wrap:break-word;color:#0000cd;font-weight:normal;text-decoration:underline">Change Password</a></span></span></p>
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Do not share your password to anyone.</span></span></p>
                                                        <p style="margin:0;padding-bottom:1em"> </p>
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Thank you,</span></span></p>
                                                        <p style="margin:0;padding-bottom:0"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Cargo Team</span></span></p>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </table>
                          <!--[if !mso]><!-->
                        </div>
                      </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </center>
        </body>
    </html>
    `;
       return template;
    },

    exports.contactUs = function(result) {
      console.log("RESULTTTTT",result)
        const template = `<!DOCTYPE html>
  <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Enquiry Details</title>
  
          <style type="text/css">
              @media only screen and (max-width: 480px) {
              body,
              table,
              td,
              p,
              a,
              li,
              blockquote {
                  -webkit-text-size-adjust: none !important
              }
              body {
                  width: 100% !important;
                  min-width: 100% !important
              }
              td[id=bodyCell] {
                  padding: 10px !important
              }
              table.kmMobileHide {
                  display: none !important
              }
              table[class=kmTextContentContainer] {
                  width: 100% !important
              }
              table[class=kmBoxedTextContentContainer] {
                  width: 100% !important
              }
              td[class=kmImageContent] {
                  padding-left: 0 !important;
                  padding-right: 0 !important
              }
              img[class=kmImage],
              img.kmImage {
                  width: 100% !important
              }
              td.kmMobileStretch {
                  padding-left: 0 !important;
                  padding-right: 0 !important
              }
              table[class=kmSplitContentLeftContentContainer],
              table.kmSplitContentLeftContentContainer,
              table[class=kmSplitContentRightContentContainer],
              table.kmSplitContentRightContentContainer,
              table[class=kmColumnContainer],
              td[class=kmVerticalButtonBarContentOuter] table[class=kmButtonBarContent],
              td[class=kmVerticalButtonCollectionContentOuter] table[class=kmButtonCollectionContent],
              table[class=kmVerticalButton],
              table[class=kmVerticalButtonContent] {
                  width: 100% !important
              }
              td[class=kmButtonCollectionInner] {
                  padding-left: 9px !important;
                  padding-right: 9px !important;
                  padding-top: 9px !important;
                  padding-bottom: 0 !important;
                  background-color: transparent !important
              }
              td[class=kmVerticalButtonIconContent],
              td[class=kmVerticalButtonTextContent],
              td[class=kmVerticalButtonContentOuter] {
                  padding-left: 0 !important;
                  padding-right: 0 !important;
                  padding-bottom: 9px !important
              }
              table[class=kmSplitContentLeftContentContainer] td[class=kmTextContent],
              table[class=kmSplitContentRightContentContainer] td[class=kmTextContent],
              table[class=kmColumnContainer] td[class=kmTextContent],
              table[class=kmSplitContentLeftContentContainer] td[class=kmImageContent],
              table[class=kmSplitContentRightContentContainer] td[class=kmImageContent],
              table.kmSplitContentLeftContentContainer td.kmImageContent,
              table.kmSplitContentRightContentContainer td.kmImageContent {
                  padding-top: 9px !important
              }
              td[class="rowContainer kmFloatLeft"],
              td.rowContainer.kmFloatLeft,
              td[class="rowContainer kmFloatLeft firstColumn"],
              td.rowContainer.kmFloatLeft.firstColumn,
              td[class="rowContainer kmFloatLeft lastColumn"],
              td.rowContainer.kmFloatLeft.lastColumn {
                  float: left;
                  clear: both;
                  width: 100% !important
              }
              table[class=templateContainer],
              table[class="templateContainer brandingContainer"],
              div[class=templateContainer],
              div[class="templateContainer brandingContainer"],
              table[class=templateRow] {
                  max-width: 600px !important;
                  width: 100% !important
              }
              h1 {
                  font-size: 24px !important;
                  line-height: 130% !important
              }
              h2 {
                  font-size: 20px !important;
                  line-height: 130% !important
              }
              h3 {
                  font-size: 18px !important;
                  line-height: 130% !important
              }
              h4 {
                  font-size: 16px !important;
                  line-height: 130% !important
              }
              td[class=kmTextContent] {
                  font-size: 14px !important;
                  line-height: 130% !important
              }
              td[class=kmTextBlockInner] td[class=kmTextContent] {
                  padding-right: 18px !important;
                  padding-left: 18px !important
              }
              table[class="kmTableBlock kmTableMobile"] td[class=kmTableBlockInner] {
                  padding-left: 9px !important;
                  padding-right: 9px !important
              }
              table[class="kmTableBlock kmTableMobile"] td[class=kmTableBlockInner] [class=kmTextContent] {
                  font-size: 14px !important;
                  line-height: 130% !important;
                  padding-left: 4px !important;
                  padding-right: 4px !important
              }
              }
          </style>
          <!--[if mso]>
          <style>
            
            .templateContainer {
              border: 1px none #aaaaaa;
              background-color: #FFFFFF;
              
            }
            #brandingContainer {
              background-color: transparent !important;
              border: 0;
            }
            
            
            .templateContainerInner {
              padding: 0px;
            }
            
          </style>
          <![endif]-->
      </head>
        <body style="margin:0;padding:0;background-color:#FFF">
          <center>
            <table align="center" border="0" cellpadding="0" cellspacing="0" id="bodyTable" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding:0;background-color:#FFF;height:100%;margin:0;width:100%">
              <tbody>
                <tr>
                  <td align="center" id="bodyCell" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding-top:50px;padding-left:20px;padding-bottom:20px;padding-right:20px;border-top:0;height:100%;margin:0;width:100%">
                    <!--[if !mso]><!-->
                    <div class="templateContainer" style="border:1px none #aaa;background-color:#FFF;display: table; width:600px">
                      <div class="templateContainerInner" style="padding:0">
                        <!--<![endif]-->
                  <!--[if mso]>
                    <table border="0" cellpadding="0" cellspacing="0" class="templateContainer"  width="600" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                    <tbody>
                      <tr>
                        <td class="templateContainerInner" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                          <![endif]-->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                            <tr>
                              <td align="center" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                <table border="0" cellpadding="0" cellspacing="0" class="templateRow" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                  <tbody>
                                    <tr>
                                      <td class="rowContainer kmFloatLeft" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                        <table border="0" cellpadding="0" cellspacing="0" class="kmTextBlock" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                          <tbody class="kmTextBlockOuter">
                                            <tr>
                                              <td class="kmTextBlockInner" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                                                <table align="left" border="0" cellpadding="0" cellspacing="0" class="kmTextContentContainer" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                                  <tbody>
                                                    <tr>
                                                      <td class="kmTextContent" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;color:#000;font-family:Helvetica, Arial;font-size:14px;line-height:150%;text-align:left;padding-top:9px;padding-bottom:9px;padding-left:18px;padding-right:18px;">
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        
                                        <table border="0" cellpadding="0" cellspacing="0" class="kmTextBlock" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                          <tbody class="kmTextBlockOuter">
                                            <tr>
                                              <td class="kmTextBlockInner" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                                                <table align="left" border="0" cellpadding="0" cellspacing="0" class="kmTextContentContainer" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                                  <tbody>
                                                    <tr>
                                                      <td class="kmTextContent" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;color:#000;font-family:Helvetica, Arial;font-size:14px;line-height:150%;text-align:left;padding-top:9px;padding-bottom:9px;padding-left:18px;padding-right:18px;">
                                                        <span style="color:#000000;"></span>
                                                        <!-- Your Content As below -->
                                                        <p style="margin:0;padding-bottom:1em;text-align: justify;"><span style="font-size:16px;"><span style="color: rgb(0, 0, 0);"><span style="font-family: arial,helvetica,sans-serif;"></span></span></span></p>
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Dear <strong> Host </strong>,</span></span></p>
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Please check below customer enquiry details</span></span></p>
                                                        <p style="margin:0;padding-bottom:1em"> </p>
                                                        
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Customer Name : ${result.name} </span></span></p>
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Customer Email : ${result.email} </span></span></p>
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">CodeId : ${result.code_id} </span></span></p>
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Message : ${result.phone} </span></span></p>
                                                        <p style="margin:0;padding-bottom:1em"> </p>
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Thank you,</span></span></p>
                                                        <p style="margin:0;padding-bottom:0"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Cargo Team</span></span></p>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </table>
                          <!--[if !mso]><!-->
                        </div>
                      </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </center>
        </body>
    </html>
    `;
    return template;
    },

    exports.sendOTP = function(result){

      const template = `<!DOCTYPE html>
  <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Forgot Password</title>
  
          <style type="text/css">
              @media only screen and (max-width: 480px) {
              body,
              table,
              td,
              p,
              a,
              li,
              blockquote {
                  -webkit-text-size-adjust: none !important
              }
              body {
                  width: 100% !important;
                  min-width: 100% !important
              }
              td[id=bodyCell] {
                  padding: 10px !important
              }
              table.kmMobileHide {
                  display: none !important
              }
              table[class=kmTextContentContainer] {
                  width: 100% !important
              }
              table[class=kmBoxedTextContentContainer] {
                  width: 100% !important
              }
              td[class=kmImageContent] {
                  padding-left: 0 !important;
                  padding-right: 0 !important
              }
              img[class=kmImage],
              img.kmImage {
                  width: 100% !important
              }
              td.kmMobileStretch {
                  padding-left: 0 !important;
                  padding-right: 0 !important
              }
              table[class=kmSplitContentLeftContentContainer],
              table.kmSplitContentLeftContentContainer,
              table[class=kmSplitContentRightContentContainer],
              table.kmSplitContentRightContentContainer,
              table[class=kmColumnContainer],
              td[class=kmVerticalButtonBarContentOuter] table[class=kmButtonBarContent],
              td[class=kmVerticalButtonCollectionContentOuter] table[class=kmButtonCollectionContent],
              table[class=kmVerticalButton],
              table[class=kmVerticalButtonContent] {
                  width: 100% !important
              }
              td[class=kmButtonCollectionInner] {
                  padding-left: 9px !important;
                  padding-right: 9px !important;
                  padding-top: 9px !important;
                  padding-bottom: 0 !important;
                  background-color: transparent !important
              }
              td[class=kmVerticalButtonIconContent],
              td[class=kmVerticalButtonTextContent],
              td[class=kmVerticalButtonContentOuter] {
                  padding-left: 0 !important;
                  padding-right: 0 !important;
                  padding-bottom: 9px !important
              }
              table[class=kmSplitContentLeftContentContainer] td[class=kmTextContent],
              table[class=kmSplitContentRightContentContainer] td[class=kmTextContent],
              table[class=kmColumnContainer] td[class=kmTextContent],
              table[class=kmSplitContentLeftContentContainer] td[class=kmImageContent],
              table[class=kmSplitContentRightContentContainer] td[class=kmImageContent],
              table.kmSplitContentLeftContentContainer td.kmImageContent,
              table.kmSplitContentRightContentContainer td.kmImageContent {
                  padding-top: 9px !important
              }
              td[class="rowContainer kmFloatLeft"],
              td.rowContainer.kmFloatLeft,
              td[class="rowContainer kmFloatLeft firstColumn"],
              td.rowContainer.kmFloatLeft.firstColumn,
              td[class="rowContainer kmFloatLeft lastColumn"],
              td.rowContainer.kmFloatLeft.lastColumn {
                  float: left;
                  clear: both;
                  width: 100% !important
              }
              table[class=templateContainer],
              table[class="templateContainer brandingContainer"],
              div[class=templateContainer],
              div[class="templateContainer brandingContainer"],
              table[class=templateRow] {
                  max-width: 600px !important;
                  width: 100% !important
              }
              h1 {
                  font-size: 24px !important;
                  line-height: 130% !important
              }
              h2 {
                  font-size: 20px !important;
                  line-height: 130% !important
              }
              h3 {
                  font-size: 18px !important;
                  line-height: 130% !important
              }
              h4 {
                  font-size: 16px !important;
                  line-height: 130% !important
              }
              td[class=kmTextContent] {
                  font-size: 14px !important;
                  line-height: 130% !important
              }
              td[class=kmTextBlockInner] td[class=kmTextContent] {
                  padding-right: 18px !important;
                  padding-left: 18px !important
              }
              table[class="kmTableBlock kmTableMobile"] td[class=kmTableBlockInner] {
                  padding-left: 9px !important;
                  padding-right: 9px !important
              }
              table[class="kmTableBlock kmTableMobile"] td[class=kmTableBlockInner] [class=kmTextContent] {
                  font-size: 14px !important;
                  line-height: 130% !important;
                  padding-left: 4px !important;
                  padding-right: 4px !important
              }
              }
          </style>
          <!--[if mso]>
          <style>
            
            .templateContainer {
              border: 1px none #aaaaaa;
              background-color: #FFFFFF;
              
            }
            #brandingContainer {
              background-color: transparent !important;
              border: 0;
            }
            
            
            .templateContainerInner {
              padding: 0px;
            }
            
          </style>
          <![endif]-->
      </head>
        <body style="margin:0;padding:0;background-color:#FFF">
          <center>
            <table align="center" border="0" cellpadding="0" cellspacing="0" id="bodyTable" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding:0;background-color:#FFF;height:100%;margin:0;width:100%">
              <tbody>
                <tr>
                  <td align="center" id="bodyCell" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding-top:50px;padding-left:20px;padding-bottom:20px;padding-right:20px;border-top:0;height:100%;margin:0;width:100%">
                    <!--[if !mso]><!-->
                    <div class="templateContainer" style="border:1px none #aaa;background-color:#FFF;display: table; width:600px">
                      <div class="templateContainerInner" style="padding:0">
                        <!--<![endif]-->
                  <!--[if mso]>
                    <table border="0" cellpadding="0" cellspacing="0" class="templateContainer"  width="600" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                    <tbody>
                      <tr>
                        <td class="templateContainerInner" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                          <![endif]-->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                            <tr>
                              <td align="center" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                <table border="0" cellpadding="0" cellspacing="0" class="templateRow" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                  <tbody>
                                    <tr>
                                      <td class="rowContainer kmFloatLeft" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                        <table border="0" cellpadding="0" cellspacing="0" class="kmTextBlock" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                          <tbody class="kmTextBlockOuter">
                                            <tr>
                                              <td class="kmTextBlockInner" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                                                <table align="left" border="0" cellpadding="0" cellspacing="0" class="kmTextContentContainer" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                                  <tbody>
                                                    <tr>
                                                      <td class="kmTextContent" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;color:#000;font-family:Helvetica, Arial;font-size:14px;line-height:150%;text-align:left;padding-top:9px;padding-bottom:9px;padding-left:18px;padding-right:18px;">
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        
                                        <table border="0" cellpadding="0" cellspacing="0" class="kmTextBlock" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                          <tbody class="kmTextBlockOuter">
                                            <tr>
                                              <td class="kmTextBlockInner" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                                                <table align="left" border="0" cellpadding="0" cellspacing="0" class="kmTextContentContainer" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                                  <tbody>
                                                    <tr>
                                                      <td class="kmTextContent" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;color:#000;font-family:Helvetica, Arial;font-size:14px;line-height:150%;text-align:left;padding-top:9px;padding-bottom:9px;padding-left:18px;padding-right:18px;">
                                                        <span style="color:#000000;"></span>
                                                        <!-- Your Content As below -->
                                                        <p style="margin:0;padding-bottom:1em;text-align: justify;"><span style="font-size:16px;"><span style="color: rgb(0, 0, 0);"><span style="font-family: arial,helvetica,sans-serif;"></span></span></span></p>
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Dear <strong>${result.name}</strong>,</span></span></p>
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Please use below otp to verify your account!</span></span></p>
                                                        <p style="margin:0;padding-bottom:1em"> </p>
                                                        
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Here is your OTP: ${result.otp}</p>
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Do not share your otp to anyone.</span></span></p>
                                                        <p style="margin:0;padding-bottom:1em"> </p>
                                                        <p style="margin:0;padding-bottom:1em"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Thank you,</span></span></p>
                                                        <p style="margin:0;padding-bottom:0"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size: 16px;">Cargo Team</span></span></p>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </table>
                          <!--[if !mso]><!-->
                        </div>
                      </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </center>
        </body>
    </html>
      `;

      return template;
    },

    exports.welcomeEmail = function(user) {
      const template = `<!DOCTYPE html>
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Welcome to Cargo Rider</title>
          <style type="text/css">
             @media only screen and (max-width: 480px) {
              body,
              table,
              td,
              p,
              a,
              li,
              blockquote {
                  -webkit-text-size-adjust: none !important
              }
              body {
                  width: 100% !important;
                  min-width: 100% !important
              }
              td[id=bodyCell] {
                  padding: 10px !important
              }
              table.kmMobileHide {
                  display: none !important
              }
              table[class=kmTextContentContainer] {
                  width: 100% !important
              }
              table[class=kmBoxedTextContentContainer] {
                  width: 100% !important
              }
              td[class=kmImageContent] {
                  padding-left: 0 !important;
                  padding-right: 0 !important
              }
              img[class=kmImage],
              img.kmImage {
                  width: 100% !important
              }
              td.kmMobileStretch {
                  padding-left: 0 !important;
                  padding-right: 0 !important
              }
              table[class=kmSplitContentLeftContentContainer],
              table.kmSplitContentLeftContentContainer,
              table[class=kmSplitContentRightContentContainer],
              table.kmSplitContentRightContentContainer,
              table[class=kmColumnContainer],
              td[class=kmVerticalButtonBarContentOuter] table[class=kmButtonBarContent],
              td[class=kmVerticalButtonCollectionContentOuter] table[class=kmButtonCollectionContent],
              table[class=kmVerticalButton],
              table[class=kmVerticalButtonContent] {
                  width: 100% !important
              }
              td[class=kmButtonCollectionInner] {
                  padding-left: 9px !important;
                  padding-right: 9px !important;
                  padding-top: 9px !important;
                  padding-bottom: 0 !important;
                  background-color: transparent !important
              }
              td[class=kmVerticalButtonIconContent],
              td[class=kmVerticalButtonTextContent],
              td[class=kmVerticalButtonContentOuter] {
                  padding-left: 0 !important;
                  padding-right: 0 !important;
                  padding-bottom: 9px !important
              }
              table[class=kmSplitContentLeftContentContainer] td[class=kmTextContent],
              table[class=kmSplitContentRightContentContainer] td[class=kmTextContent],
              table[class=kmColumnContainer] td[class=kmTextContent],
              table[class=kmSplitContentLeftContentContainer] td[class=kmImageContent],
              table[class=kmSplitContentRightContentContainer] td[class=kmImageContent],
              table.kmSplitContentLeftContentContainer td.kmImageContent,
              table.kmSplitContentRightContentContainer td.kmImageContent {
                  padding-top: 9px !important
              }
              td[class="rowContainer kmFloatLeft"],
              td.rowContainer.kmFloatLeft,
              td[class="rowContainer kmFloatLeft firstColumn"],
              td.rowContainer.kmFloatLeft.firstColumn,
              td[class="rowContainer kmFloatLeft lastColumn"],
              td.rowContainer.kmFloatLeft.lastColumn {
                  float: left;
                  clear: both;
                  width: 100% !important
              }
              table[class=templateContainer],
              table[class="templateContainer brandingContainer"],
              div[class=templateContainer],
              div[class="templateContainer brandingContainer"],
              table[class=templateRow] {
                  max-width: 600px !important;
                  width: 100% !important
              }
              h1 {
                  font-size: 24px !important;
                  line-height: 130% !important
              }
              h2 {
                  font-size: 20px !important;
                  line-height: 130% !important
              }
              h3 {
                  font-size: 18px !important;
                  line-height: 130% !important
              }
              h4 {
                  font-size: 16px !important;
                  line-height: 130% !important
              }
              td[class=kmTextContent] {
                  font-size: 14px !important;
                  line-height: 130% !important
              }
              td[class=kmTextBlockInner] td[class=kmTextContent] {
                  padding-right: 18px !important;
                  padding-left: 18px !important
              }
              table[class="kmTableBlock kmTableMobile"] td[class=kmTableBlockInner] {
                  padding-left: 9px !important;
                  padding-right: 9px !important
              }
              table[class="kmTableBlock kmTableMobile"] td[class=kmTableBlockInner] [class=kmTextContent] {
                  font-size: 14px !important;
                  line-height: 130% !important;
                  padding-left: 4px !important;
                  padding-right: 4px !important
              }
              }
          </style>
          <!--[if mso]>
          <style>
            .templateContainer {
              border: 1px none #aaaaaa;
              background-color: #FFFFFF;
            }
            #brandingContainer {
              background-color: transparent !important;
              border: 0;
            }
            .templateContainerInner {
              padding: 0px;
            }
          </style>
          <![endif]-->
        </head>
        <body style="margin:0;padding:0;background-color:#FFF">
          <center>
            <table align="center" border="0" cellpadding="0" cellspacing="0" id="bodyTable" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding:0;background-color:#FFF;height:100%;margin:0;width:100%">
              <tbody>
                <tr>
                  <td align="center" id="bodyCell" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding-top:50px;padding-left:20px;padding-bottom:20px;padding-right:20px;border-top:0;height:100%;margin:0;width:100%">
                    <!--[if !mso]><!-->
                    <div class="templateContainer" style="border:1px none #aaa;background-color:#FFF;display: table; width:600px">
                      <div class="templateContainerInner" style="padding:0">
                        <!--<![endif]-->
                        <!--[if mso]>
                        <table border="0" cellpadding="0" cellspacing="0" class="templateContainer" width="600" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                          <tbody>
                            <tr>
                              <td class="templateContainerInner" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                        <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                          <tr>
                            <td align="center" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                              <table border="0" cellpadding="0" cellspacing="0" class="templateRow" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                <tbody>
                                  <tr>
                                    <td class="rowContainer kmFloatLeft" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                      <!-- Logo Header -->
                                      <table border="0" cellpadding="0" cellspacing="0" class="kmTextBlock" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                        <tbody class="kmTextBlockOuter">
                                          <tr>
                                            <td class="kmTextBlockInner" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                                              <table align="center" border="0" cellpadding="0" cellspacing="0" class="kmTextContentContainer" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                                <tbody>
                                                  <tr>
                                                    <td class="kmTextContent" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;padding-top:20px;padding-bottom:20px;text-align:center;">
                                                      <img src="https://example.com/logo.png" alt="Cargo Rider Logo" width="180" style="border:0;height:auto;line-height:100%;outline:none;text-decoration:none;max-width:100%;">
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      
                                      <!-- Welcome Message -->
                                      <table border="0" cellpadding="0" cellspacing="0" class="kmTextBlock" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                        <tbody class="kmTextBlockOuter">
                                          <tr>
                                            <td class="kmTextBlockInner" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
                                              <table align="left" border="0" cellpadding="0" cellspacing="0" class="kmTextContentContainer" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0">
                                                <tbody>
                                                  <tr>
                                                    <td class="kmTextContent" valign="top" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;color:#000;font-family:Helvetica, Arial;font-size:14px;line-height:150%;text-align:left;padding-top:9px;padding-bottom:9px;padding-left:18px;padding-right:18px;">
                                                      <p style="margin:0;padding-bottom:1em;text-align:center;">
                                                        <span style="font-size:24px;font-weight:bold;color:#2c3e50;">Welcome to Cargo Rider!</span>
                                                      </p>
                                                      <p style="margin:0;padding-bottom:1em">
                                                        <span style="font-family:arial,helvetica,sans-serif;font-size:16px;">
                                                          Dear <strong>${user.name}</strong>,
                                                        </span>
                                                      </p>
                                                      <p style="margin:0;padding-bottom:1em">
                                                        <span style="font-family:arial,helvetica,sans-serif;font-size:16px;">
                                                          Thank you for joining Cargo Rider! We're excited to have you on board and look forward to serving all your cargo transportation needs.
                                                        </span>
                                                      </p>
                                                      <p style="margin:0;padding-bottom:1em">
                                                        <span style="font-family:arial,helvetica,sans-serif;font-size:16px;">
                                                          Your account has been successfully created and you can now start using our platform for seamless cargo transportation services.
                                                        </span>
                                                      </p>
                                                      <p style="margin:0;padding-bottom:1em;text-align:center;">
                                                        GET STARTED
                                                      </p>
                                                      <p style="margin:0;padding-bottom:1em">
                                                        <span style="font-family:arial,helvetica,sans-serif;font-size:16px;">
                                                          If you have any questions or need assistance, our support team is always ready to help.
                                                        </span>
                                                      </p>
                                                      <p style="margin:0;padding-bottom:1em">
                                                        <span style="font-family:arial,helvetica,sans-serif;font-size:16px;">
                                                          Happy Riding!
                                                        </span>
                                                      </p>
                                                      <p style="margin:0;padding-bottom:0">
                                                        <span style="font-family:arial,helvetica,sans-serif;font-size:16px;">
                                                          Best Regards,<br>
                                                          <strong>The Cargo Rider Team</strong>
                                                        </span>
                                                      </p>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!--[if !mso]><!-->
                      </div>
                    </div>
                    <!--<![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </center>
        </body>
      </html>`;
    
      return template;
    },

    exports.orderConfirmationEmail = function(orderData) {
      const template = `<!DOCTYPE html>
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Order Confirmation - Cargo Rider</title>
          <style type="text/css">
            /* Reset and Base Styles */
            body, table, td, a { 
              -webkit-text-size-adjust: 100%; 
              -ms-text-size-adjust: 100%; 
            }
            table, td { 
              mso-table-lspace: 0pt; 
              mso-table-rspace: 0pt; 
            }
            img { 
              -ms-interpolation-mode: bicubic; 
              border: 0; 
              height: auto; 
              line-height: 100%; 
              outline: none; 
              text-decoration: none; 
            }
    
            /* Email Container */
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #f4f4f4;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
    
            /* Header Styles */
            .email-header {
              background-color: #2c3e50;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .email-logo {
              max-width: 150px;
              margin-bottom: 10px;
            }
            .email-title {
              font-size: 24px;
              margin: 0;
              color: white;
            }
            .order-id {
              color: #bdc3c7;
              font-size: 14px;
              margin-top: 5px;
            }
    
            /* Status Indicator */
            .order-status {
              background-color: #3498db;
              color: white;
              padding: 10px;
              text-align: center;
              font-weight: bold;
              border-radius: 4px;
              margin: 15px 0;
            }
    
            /* Section Styles */
            .email-section {
              background-color: white;
              border-radius: 8px;
              margin: 15px;
              padding: 20px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .section-title {
              border-bottom: 2px solid #3498db;
              padding-bottom: 10px;
              margin-bottom: 15px;
              color: #2c3e50;
              font-size: 18px;
            }
            .detail-row {
              display: flex;
              margin-bottom: 10px;
              padding: 5px 0;
              border-bottom: 1px solid #ecf0f1;
            }
            .detail-label {
              font-weight: 600;
              color: #2c3e50;
              flex: 0 0 40%;
              padding-right: 10px;
            }
            .detail-value {
              color: #34495e;
              flex: 1;
            }
    
            /* Payment Summary */
            .payment-summary {
              background-color: #f8f9fa;
              border-radius: 8px;
              padding: 20px;
              margin: 15px;
            }
            .payment-total {
              font-size: 20px;
              font-weight: bold;
              color: #2c3e50;
              text-align: right;
              margin-top: 15px;
            }
    
            /* Footer */
            .email-footer {
              background-color: #2c3e50;
              color: white;
              text-align: center;
              padding: 20px;
              font-size: 12px;
            }
    
            /* Responsive Adjustments */
            @media only screen and (max-width: 600px) {
              .email-container {
                width: 100% !important;
                margin: 0 !important;
              }
              .email-section, .payment-summary {
                margin: 10px !important;
                padding: 15px !important;
              }
              .detail-row {
                flex-direction: column;
              }
              .detail-label {
                margin-bottom: 5px;
              }
            }
          </style>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <div class="email-container">
                  <!-- Header -->
                  <div class="email-header">
                    <img src="https://example.com/logo.png" alt="Cargo Rider" class="email-logo" />
                    <h1 class="email-title">Order Confirmation</h1>
                    <div class="order-id">Order ID: ${orderData.order_id}</div>
                  </div>
    
                  <!-- Order Status -->
                  <div class="order-status">
                    Status: ${orderData.order_status} (${orderData.delivery_status})
                  </div>
    
                  <!-- Sender Information -->
                  <div class="email-section">
                    <h3 class="section-title">Sender Information</h3>
                    <div class="detail-row">
                      <div class="detail-label">Name</div>
                      <div class="detail-value">${orderData.sender.name}</div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-label">Email</div>
                      <div class="detail-value">${orderData.sender.email}</div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-label">Phone</div>
                      <div class="detail-value">${orderData.sender.phone}</div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-label">Address</div>
                      <div class="detail-value">${orderData.sender.address}</div>
                    </div>
                  </div>
    
                  <!-- Receiver Information -->
                  <div class="email-section">
                    <h3 class="section-title">Receiver Information</h3>
                    <div class="detail-row">
                      <div class="detail-label">Name</div>
                      <div class="detail-value">${orderData.receiver.name}</div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-label">Email</div>
                      <div class="detail-value">${orderData.receiver.email}</div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-label">Phone</div>
                      <div class="detail-value">${orderData.receiver.phone}</div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-label">Address</div>
                      <div class="detail-value">${orderData.receiver.address}</div>
                    </div>
                  </div>
    
                  <!-- Delivery Details -->
                  <div class="email-section">
                    <h3 class="section-title">Delivery Details</h3>
                    <div class="detail-row">
                      <div class="detail-label">Pickup Location</div>
                      <div class="detail-value">${orderData.pick_up_loc}</div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-label">Dropoff Location</div>
                      <div class="detail-value">${orderData.drop_off_loc}</div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-label">Estimated Distance</div>
                      <div class="detail-value">${orderData.distance}</div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-label">Estimated Time</div>
                      <div class="detail-value">${orderData.time}</div>
                    </div>
                  </div>
    
                  <!-- Package Details -->
                  <div class="email-section">
                    <h3 class="section-title">Package Details</h3>
                    ${Object.entries(orderData.item).map(([key, value]) => `
                    <div class="detail-row">
                      <div class="detail-label">${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                      <div class="detail-value">${value}</div>
                    </div>
                    `).join('')}
                  </div>
    
                  <!-- Payment Summary -->
                  <div class="payment-summary">
                    <h3 class="section-title">Payment Summary</h3>
                    <div class="detail-row">
                      <div class="detail-label">Payment Method</div>
                      <div class="detail-value">${orderData.payment_data}</div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-label">Subtotal</div>
                      <div class="detail-value">$${orderData.subtotal}</div>
                    </div>
                    ${orderData.tax ? `
                    <div class="detail-row">
                      <div class="detail-label">Tax</div>
                      <div class="detail-value">$${orderData.tax}</div>
                    </div>` : ''}
                    ${orderData.discount ? `
                    <div class="detail-row">
                      <div class="detail-label">Discount</div>
                      <div class="detail-value">-$${orderData.discount}</div>
                    </div>` : ''}
                    <div class="payment-total">
                      Total: $${orderData.total_price}
                    </div>
                  </div>
    
                  <!-- Footer -->
                  <div class="email-footer">
                    <p>© 2024 Cargo Rider. All rights reserved.</p>
                    <p>Thank you for choosing our service!</p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </body>
      </html>`;
      
      return template;
    };






// https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module