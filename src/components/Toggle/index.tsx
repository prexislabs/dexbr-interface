import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'


const ToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean }>`
  padding: 0.25rem 0.5rem;
  background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.primary1 : theme.text4) : 'none')};
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.white : theme.text2) : theme.text3)};
  font-size: 0.825rem;
  font-weight: 400;
`

const StyledToggle = styled.a<{ isActive?: boolean; activeElement?: boolean }>`
  border: 1px solid ${({ theme, isActive }) => (isActive ? theme.primary5 : theme.text4)};
  display: flex;
  width: fit-content;
  cursor: pointer;
  text-decoration: none;
  :hover {
    text-decoration: none;
  }
`

export interface ToggleProps {
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ isActive, toggle }: ToggleProps) {
  const { t } = useTranslation()

  return (
    <StyledToggle isActive={isActive} target="_self" onClick={toggle}>
      <ToggleElement isActive={isActive} isOnSwitch={true}>
        {t('On')}
      </ToggleElement>
      <ToggleElement isActive={!isActive} isOnSwitch={false}>
      {t('Off')}
      </ToggleElement>
    </StyledToggle>
  )
}
