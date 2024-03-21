import { useParams } from "react-router-dom";

export function JamsIndexLayout() {
  const { jamId } = useParams();

  console.log(jamId)

  return <h1>Jams</h1>;
}
