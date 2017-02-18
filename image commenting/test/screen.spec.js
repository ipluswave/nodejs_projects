/*eslint-disable*/
import React from 'react'
import { mount, shallow } from 'enzyme'
import { expect } from 'chai'

import Screen from '../src/components/screen'

describe('<Screen/>', () => {
  it('The screen component should have block with class "screen"', () => {
    const enzymescreen = shallow(<Screen/>)
    expect(enzymescreen.find('.screen')).to.have.length(1)
  })
  it('The screen component should have the state of background', () => {
    const enzymescreen = shallow(<Screen/>)
    expect(enzymescreen.state('background')).to.exist
  })
})
/*eslint-enable*/