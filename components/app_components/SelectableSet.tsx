"use client";

import React, { useState } from 'react'

type Props = {
    setName: string;
    toggleSelect: (id: string) => void;
}

const SelectableSet = ({setName, toggleSelect}: Props) => {

    const [selected, setSelected] = useState(false);

  return (
    <div onClick={() => {
        toggleSelect(setName);
        setSelected(!selected);
    }} className={`flex rounded-[10px] py-[10px] justify-center cursor-pointer font-sora text-white text-[20px] ${selected ? "bg-[#708AAD]" : "bg-[#3D516D]"} flex-1/4`}>
        {setName}
    </div>
  )
}

export default SelectableSet