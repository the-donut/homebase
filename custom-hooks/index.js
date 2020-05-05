import React from "react"

import DONUTLogo from "./logo";
import Newsletters from "./newsletters";

export default {
  logo: () => <DONUTLogo/>,
  pages: () => [
    {
      label: 'Newsletters Dashboard',
      path: '/dashboard/newsletters',
      component: Newsletters,
    },{
      label: 'Newsletters',
      children: [
        { listKey: 'Newsletter' },
        { listKey: 'Sponsor' },
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