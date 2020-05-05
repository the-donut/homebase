import React, { useState } from "react";

import "../styles/newsletter-cards.css";

export default function NewsletterCards(props) {
  const [promptEmailModal, setPromptEmailModal] = useState(false)
  const [reicipientEmail, setRecipientEmail] = useState('')
  const newsletters = props.newsletters;

  const sendPreviewStart = () => {
    setPromptEmailModal(true)
  }

  const sendPreview = (campaignId) => {
    fetch('/admin/sendNewsletterPreview', {
      method: 'POST',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        recipients: reicipientEmail,
        campaignId: campaignId
      })
    }).then(() => {
      setPromptEmailModal(false);
      setRecipientEmail('')
    })
  }

  const setValue = (e) => {
    setRecipientEmail(e.target.value)
  }

  return (
    <div>
      {
        newsletters.map(newsletter => {
          return (
            <div className="newsletter-card" key={newsletter.id}>
              {promptEmailModal && (
                <div className="send-preview-modal">
                  <div className="preview-content">
                    <label>Send preview to:</label>
                    <input onChange={setValue} defaultValue={reicipientEmail} type="text" placeholder="email" />
                    <button onClick={() => sendPreview(newsletter.campaignId)}>
                      Send Preview
                    </button>
                    <button onClick={() => setPromptEmailModal(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <img src={newsletter.image.publicUrl}/>
              <p>{newsletter.name}</p>
              <p>Send date: {new Date(newsletter.sendDate).toLocaleString()}</p>
              <button onClick={sendPreviewStart}>
                Send Preview
              </button>
            </div>
          )
        })
      }
    </div>
  )
}