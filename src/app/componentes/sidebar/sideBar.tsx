import React, { useState } from 'react'
import { Container, Content } from './style'
import { 
  FaTimes, 
  FaHome, 
  FaRegCalendarAlt,
  FaChartBar,
  FaChartArea,
  FaClock
} from 'react-icons/fa';
import {SidebarItem} from "../sideBarItem/sideBarItem";
import { FaChartColumn } from 'react-icons/fa6';


export const Sidebar = ({ active, setPressButton }:{active:any, setPressButton:any}) => {

  const closeSidebar = () => {
    active(false)
  }



  return (
    <Container sidebar={active}>
      <FaTimes onClick={closeSidebar} />  
      <Content>
        <SidebarItem Icon={FaHome} Text="Em tempo real" href='/'/>
        <SidebarItem Icon={FaChartBar} Text="Graficos Temperatura" href='/graficosPaginas/temperaturas'/>
        <SidebarItem Icon={FaChartColumn} Text="potencia" href='/graficosPaginas/potencia'/>
        <SidebarItem Icon={FaChartArea} Text="corrente x tensao" href='/graficosPaginas/tensaoECorrente'/>
        <SidebarItem Icon={FaClock} Text="Graficos por hora" href='/'/>
        <SidebarItem Icon={FaRegCalendarAlt} Text="Graficos por dia" href='/'/>
        <SidebarItem Icon={FaRegCalendarAlt} Text="Graficos por mes" href='/'/>
        <SidebarItem Icon={FaRegCalendarAlt} Text="Graficos por ano" href='/'/>
      </Content>
    </Container>
  )
}