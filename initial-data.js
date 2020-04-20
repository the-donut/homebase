const crypto = require('crypto');
const randomString = () => crypto.randomBytes(6).hexSlice();

module.exports = async keystone => {
  // Count existing users
  const {
    data: {
      _allUsersMeta: { count },
    },
  } = await keystone.executeQuery(
    `query {
      _allUsersMeta {
        count
      }
    }`
  );

  const getClientUrl = `https://api.createsend.com/api/v3.2/clients.json`
  fetch(getClientUrl, {
    headers: {
      Authorization: `Basic ${process.env.CAMPAIGN_MONITOR_KEY}`
    }
  }).then(resp => resp.json()).then(async json => {
    json.forEach(async cmClient => {
      const clientId = cmClient.ClientID
      const clientName = cmClient.Name

      await keystone.executeQuery(
        `mutation createClient($clientId: String, $clientName: String) {
          createClient(data: {ClientID: $clientId, Name: $clientName}) {
            ClientID
          }
        }`,
        {
          variables: {
            clientId,
            clientName,
          },
        }
      );

      const getTemplatesUrl = `https://api.createsend.com/api/v3.2/clients/${clientId}/templates.json`
      fetch(getTemplatesUrl, {
        headers: {
          Authorization: `Basic ${process.env.CAMPAIGN_MONITOR_KEY}`
        }
      }).then(resp => resp.json()).then(json => {
        json.forEach(async cmTemplate => {
          const TemplateID = cmTemplate.TemplateID;
          const Name = cmTemplate.Name;
          const PreviewURL = cmTemplate.PreviewURL;
          const ScreenshotURL = cmTemplate.ScreenshotURL;

          await keystone.executeQuery(
            `mutation createTemplate($TemplateID: String, $Name: String, $PreviewURL: String, $ScreenshotURL: String) {
              createTemplate(data: {TemplateID: $TemplateID, Name: $Name, PreviewURL: $PreviewURL, ScreenshotURL: $ScreenshotURL}) {
                TemplateID
              }
            }`,
            {
              variables: {
                TemplateID,
                Name,
                PreviewURL,
                ScreenshotURL
              },
            }
          );
        })
      })

      const getListUrl = `https://api.createsend.com/api/v3.2/clients/${clientId}/lists.json`
      fetch(getListUrl, {
        headers: {
          Authorization: `Basic ${process.env.CAMPAIGN_MONITOR_KEY}`
        }
      }).then(resp => resp.json()).then(json => {
        json.forEach(async cmList => {
          const ListID = cmList.ListID;
          const Name = cmList.Name;

          await keystone.executeQuery(
            `mutation createList($ListID: String, $Name: String) {
              createList(data: {ListID: $ListID, Name: $Name}) {
                ListID
              }
            }`,
            {
              variables: {
                ListID,
                Name
              },
            }
          );
        })
      })

      const getSegmentUrl = `https://api.createsend.com/api/v3.2/clients/${clientId}/segments.json`
      fetch(getSegmentUrl, {
        headers: {
          Authorization: `Basic ${process.env.CAMPAIGN_MONITOR_KEY}`
        }
      }).then(resp => resp.json()).then(json => {
        json.forEach(async cmSegment => {
          const ListID = cmSegment.ListID;
          const SegmentID = cmSegment.SegmentID;
          const Title = cmSegment.Title;

          await keystone.executeQuery(
            `mutation createSegment($ListID: String, $Title: String, $SegmentID: String) {
              createSegment(data: {ListID: $ListID, Title: $Title, SegmentID: $SegmentID}) {
                SegmentID
              }
            }`,
            {
              variables: {
                ListID,
                SegmentID,
                Title
              },
            }
          );
        })
      })
    })
  })

  // CREATE ARTICLE TYPES
  const types = [
    "Dose of Discussion",
    "Politics and Current Events",
    "Biz, Tech, and Economy",
    "Dose of Positive",
    "Dose of Random",
    "Dose of Knowledge"
  ]

  types.forEach(async type => {
    await keystone.executeQuery(
      `mutation createArticleType($type: String) {
        createArticleType(data: {type: $type}) {
          id
        }
      }`,
      {
        variables: {
          type
        },
      }
    );
  })

  // IF THERE ARE NO USERS CREATE A NEW USER BY DEFAULT
  if (count === 0) {
    const password = randomString();
    const email = 'admin@example.com';

    await keystone.executeQuery(
      `mutation initialUser($password: String, $email: String) {
            createUser(data: {name: "Admin", email: $email, isAdmin: true, password: $password}) {
              id
            }
          }`,
      {
        variables: {
          password,
          email,
        },
      }
    );

    console.log(`
      User created:
        email: ${email}
        password: ${password}
      Please change these details after initial login.
    `);
  }
};
