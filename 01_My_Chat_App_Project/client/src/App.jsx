import Left from "./home/left/Left"
import Right from "./home/right/Right"

function App() {

  return (
    <>
      <div className="flex h-screen">
        <Left></Left>
        <Right></Right>
        <button className="btn btn-primary">
        DaisyUI Button
      </button>
      </div>
    </>
  )
}

export default App
