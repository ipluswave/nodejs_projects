/*eslint-disable*/
import React from 'react'
import { mount, shallow } from 'enzyme'
import { expect } from 'chai'

import Comment from '../src/components/comment'

describe('<Comment/>', () => {
  it('The Comment component should have block with class "comment"', () => {
    const enzymeComment = shallow(<Comment/>)
    expect(enzymeComment.find('.comment')).to.have.length(1)
  })
  it('The Comment component should have the instance state of isBtnDisabled as true', () => {
    const enzymeComment = shallow(<Comment/>)
    expect(enzymeComment.state('isBtnDisabled')).to.be.true
  })
})
/*eslint-enable*/