// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { InputMocks } from 'mocks/InputMocks';
import { InputRadioGroup } from 'components/Input/InputRadioGroup';

const {
  id, name, value, options,
} = InputMocks.inputRadioProps;

describe('InputRadioGroup', () => {
  beforeEach(() => {
    jest.spyOn(window, 'alert');
  });

  it('sets default radio button to first option', () => {
    const wrapper = shallow(
      <InputRadioGroup name={name} id={id} value={value} options={options} />,
    );
    expect(
      wrapper.find('input[id="some-option-one-id"][type="radio"]').props()
        .defaultChecked,
    ).toBe(true);
  });
});
