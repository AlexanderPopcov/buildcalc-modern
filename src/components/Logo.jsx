const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
        <span className="text-white font-bold text-lg">B</span>
      </div>
      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
        BuildCalc
      </span>
    </div>
  )
}

export default Logo