"use client"
import { useState } from "react";

export function CreateSafebox() {
  return (<>
    <div className="with-border shadow-inner shadow-blue-400 px-10 flex flex-col items-center gap-4">
      <h3 className="text-xl">
        create a safebox
      </h3>
      <div className="flex flex-col">
        <label htmlFor="safeboxName">
          name
        </label>
        <input 
          type="text"
          name="safeboxName"
          id="safeboxName"
          className="input-data shadow-md shadow-blue-400 focus:shadow-lg focus:shadow-blue-200"
          placeholder="my safebox"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password">
          password
        </label>
        <input 
          type="password"
          name="password"
          id="password"
          className="input-data shadow-md shadow-blue-400 focus:shadow-lg focus:shadow-blue-200"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-800 hover:bg-blue-900 active:bg-blue-950 border-2 border-blue-600 rounded-full p-1 px-4"
      >
        create
      </button>
    </div>
  </>);
}

const useCreateSafebox = () => {
  const [] = useState(null)
}