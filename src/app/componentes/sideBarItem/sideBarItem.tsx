'use client'

import React from 'react'
import { Container } from './style'
import { useRouter } from 'next/navigation'

export const SidebarItem = ({ Icon, Text, href }:{Icon:any, Text:any, href:string}) => {
  const router = useRouter();

  return (
    <Container 
      onClick={() => {
      router.push(href);
      router.refresh()
      }}>
      <Icon />
      {Text}
    </Container>
  )
}