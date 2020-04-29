import React from "react"

import DONUTLogo from "./logo";
import Campaigns from "./campaigns";

export default {
  logo: () => <DONUTLogo/>,
  pages: () => [
    {
      label: 'Campaigns',
      path: 'campaigns',
      component: Campaigns,
    },{
      label: 'Newsletters',
      children: [
        { listKey: 'Newsletter' },
        { listKey: 'Article' },
        { listKey: 'Tag' }
      ],
    },{
      label: 'Admin',
      children: [
        { listKey: 'User' }
      ]
    }
  ]
};