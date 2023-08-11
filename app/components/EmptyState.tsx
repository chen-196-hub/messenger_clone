"use client"

import Button from "./Button"
import getNFC from "../nfc/getNFC"
import { useState } from "react"


 const EmptyState = () => {
  const [ idm, setIdm ] = useState<string | undefined>("")

  const getCardId = async () => {
    setIdm("")
    const res: { type?:string, idm?: string } | undefined = await getNFC()
    console.log(res)
    setIdm(res.idm)
    console.log(idm)
  }

  return (
    <div
      className="
        px-4
        py-10
        sm:px-6
        lg:px-8
        h-full
        flex
        justify-center
        items-center
        bg-gray-100
      "
    >
      <div className="text-center items-center flex flex-col">
        <h3
          className="
            mt-2
            text-2xl
            font-semibold
            text-gray-900
          "
        >
          Select a chat or start a new conversation
        </h3>

        <h3>
          { idm }
        </h3>


        <Button onClick={ getCardId }>
            nfc
        </Button>
      </div>
    </div>
  )
}

export default EmptyState