// load env vars
require('dotenv').config();

const express = require('express');
const { keystone, apps } = require('./index.js');

keystone
  .prepare({
    apps: apps,
    dev: process.env.NODE_ENV !== 'production',
  })
  .then(async ({ middlewares }) => {
    await keystone.connect();
    const app = express();
    app.use(express.json()) // allow json content
    app.set('trust proxy', true);

    // TODO: if things grow more in the custom server here we'll want to break this out
    // to be in a routes directory, models, etc

    /**
     * Sends a campaign preview provided a recipient address and campaign id
     */
    app.post('/admin/sendNewsletterPreview', (req, res) => {
      const campaignId = req.body.campaignId;
      const campaignPreviewUrl = `https://api.createsend.com/api/v3.2/campaigns/${campaignId}/sendpreview.json`
      fetch(campaignPreviewUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${process.env.CAMPAIGN_MONITOR_KEY}`
        },
        body: JSON.stringify({
          PreviewRecipients: [req.body.recipients]
        })
      }).then(() => {
        res.sendStatus(200)
      })
    })
    console.log('Server up and running 🧨')
    app.use(middlewares).listen(process.env.PORT);
  });
