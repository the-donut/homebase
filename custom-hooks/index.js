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
        { listKey: 'ArticleType' },
        { listKey: 'Tag' }
      ],
    },{
      label: 'Campaign Monitor',
      children: [
        { listKey: 'Client' },
        { listKey: 'List' },
        { listKey: 'Segment' },
        { listKey: 'Template' },
        { listKey: 'Vertical' },
      ]
    },{
      label: 'Admin',
      children: [
        { listKey: 'User' }
      ]
    }
  ]
};