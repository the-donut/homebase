module.exports = (newsletter) => {
  return {
    "Singlelines": [
      {
        "Content": new Date(newsletter.sendDate).toLocaleDateString()
      },{
        "Content": newsletter.introTitle
      },{
        "Content": newsletter.doseOfDiscussion ? newsletter.doseOfDiscussion.title : ''
      }, {
        "Content": newsletter.DoseOfKnowledge ? newsletter.DoseOfKnowledge.title : ''
      }
    ],
    "Multilines": [
      {
        "Content": `
          <span
            style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0"
          >
            ${newsletter.preheader}
            &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
            &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
          </span>
        `
      },{
        "Content": `
          <p
            class="staybig"
            style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'poppins','helvetica neue',helvetica,arial,sans-serif;line-height:32px;color:#d1cdd0;font-size:20px"
          >
            ${newsletter.intro}
          </p>`
      },{
        "Content": `
          <p
            class="staymedium"
            style="Margin:0;padding-left:20px;padding-right:20px;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'poppins','helvetica neue',helvetica,arial,sans-serif;line-height:28px;color:#d1cdd0;font-size:16px"
          >
            <em>"${newsletter.quote}"<br/>-&nbsp;<b style="color:#ffffff">${newsletter.quoteAuthor}</b></em>
          </p>
        `
      }, {
        "Content": `
          <p style="Margin:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;mso-line-height-rule:exactly;font-family:'poppins','helvetica neue',helvetica,arial,sans-serif;line-height:22px;color:#00292d;font-size:14px">
            ${newsletter.DoseOfKnowledge ? newsletter.DoseOfKnowledge.content : ''}
          </p>
        `
      }, {
        "Content": `
          <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'poppins','helvetica neue',helvetica,arial,sans-serif;color:#fff !important;font-size:14px;line-height:22px">
            ${newsletter.DoseOfKnowledgeAnswer ? newsletter.DoseOfKnowledgeAnswer.content : ''}
          </p>
        `
      }
    ],
    "Repeaters": [
      {
        "Items": [
          {
            "Multilines": [
              {
                "Content": newsletter.doseOfDiscussion ? newsletter.doseOfDiscussion.content : ''
              }
            ]
          }
        ]
      },{
        "Items": [
          {
            "Multilines": [
              {
                "Content": newsletter.politicsAndCurrentEvents ? newsletter.politicsAndCurrentEvents.content : ''
              }
            ]
          }
        ]
      },{
        "Items": [
          {
            "Multilines": [
              {
                "Content": newsletter.BizTechAndEconomy ? newsletter.BizTechAndEconomy.content : ''
              },
            ]
          }
        ]
      },{
        "Items": [
          {
            "Multilines": [
              {
                "Content": newsletter.DoseOfPositive ? newsletter.DoseOfPositive.content : ''
              },
            ]
          }
        ]
      },{
        "Items": [
          {
            "Multilines": [
              {
                "Content": newsletter.DoseOfRandom ? newsletter.DoseOfRandom.content : ''
              }
            ]
          }
        ]
      }
    ],
    "Images": [
      {
        "Content": newsletter.image.publicUrl,
        "Alt": newsletter.introTitle,
        "Href": newsletter.image.publicUrl
      }
    ]
  }
}