/*eslint-disable*/
import React from 'react'
import { mount, shallow } from 'enzyme'
import { expect } from 'chai'

import Sidebar from '../src/components/sidebar'

describe('<Sidebar/>', () => {
  it('The Sidebar component should have block with class "sidebar"', () => {
    const enzymeSidebar = shallow(<Sidebar/>)
    expect(enzymeSidebar.find('.sidebar')).to.have.length(1)
  })
  it('The Sidebar component should have the instance state of isMinimized as false', () => {
    const enzymeSidebar = shallow(<Sidebar/>)
    expect(enzymeSidebar.state('isMinimized')).to.not.be.true
  })
})
/*eslint-enable*/