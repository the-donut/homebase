const crypto = require('crypto');
const randomString = () => crypto.randomBytes(6).hexSlice();

/**
 * TODO:
 * The initial data sets up the sync with Campaign Monitor.
 *
 * Upon load it will ping both our own database and Campaign Monitor to check
 * for any new clients, templates, segments, or lists. And add any new items
 * to our own database.
 *
 * Right now this causes a slow down in starting up the app, for now its not a big deal.
 * But we should look into creating scripts to create this new content instead of doing it
 * on server start as the bigger this gets and more data that it has to check, the longer
 * it will take to load.
 */

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

  const { data: { allClients } } = await keystone.executeQuery(
    `query {
      allClients {
        Name
      }
    }`
  );

  allClients.forEach(client => {
    const getClientUrl = `https://api.createsend.com/api/v3.2/clients.json`
    fetch(getClientUrl, {
      headers: {
        Authorization: `Basic ${process.env.CAMPAIGN_MONITOR_KEY}`
      }
    }).then(resp => resp.json()).then(async json => {
      json.forEach(async cmClient => {
        if(client.Name != cmClient.Name) {
          const clientId = cmClient.ClientID

          keystone.createItems({
            Client: json
          })

          const { data: { allTemplates } } = await keystone.executeQuery(
            `query {
              allTemplates {
                Name
              }
            }`
          );

          const { data: { allLists } } = await keystone.executeQuery(
            `query {
              allLists {
                Name
              }
            }`
          );

          const { data: { allSegments } } = await keystone.executeQuery(
            `query {
              allSegments {
                Title
              }
            }`
          );

          allTemplates.forEach(template => {
            const getTemplatesUrl = `https://api.createsend.com/api/v3.2/clients/${clientId}/templates.json`
            fetch(getTemplatesUrl, {
              headers: {
                Authorization: `Basic ${process.env.CAMPAIGN_MONITOR_KEY}`
              }
            }).then(resp => resp.json()).then(json => {
              json.forEach(cmTemplate => {
                if(template.Name != cmTemplate.Name) {
                  keystone.createItems({
                    Template: [json]
                  });
                }
              })
            })
          })

          allLists.forEach(list => {
            const getListUrl = `https://api.createsend.com/api/v3.2/clients/${clientId}/lists.json`
            fetch(getListUrl, {
              headers: {
                Authorization: `Basic ${process.env.CAMPAIGN_MONITOR_KEY}`
              }
            }).then(resp => resp.json()).then(json => {
              json.forEach(cmList => {
                if(list.Name != cmList.Name) {
                  keystone.createItems({
                    List: [json]
                  });
                }
              })
            })
          })

          allSegments.forEach(segment => {
            const getSegmentUrl = `https://api.createsend.com/api/v3.2/clients/${clientId}/segments.json`
            fetch(getSegmentUrl, {
              headers: {
                Authorization: `Basic ${process.env.CAMPAIGN_MONITOR_KEY}`
              }
            }).then(resp => resp.json()).then(json => {
              json.forEach(cmSegment => {
                if(segment.Title != cmSegment.Title) {
                  keystone.createItems({
                    Segment: [json]
                  });
                }
              })
            })
          })
        }
      })
    })
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
