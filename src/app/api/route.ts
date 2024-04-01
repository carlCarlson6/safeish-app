export function GET(request: Request) {
  return Response
    .json({ message: "hello world! from GET method" }, { status: 200 })
}

export function POST(request: Request) {
  return Response
    .json({ message: "hello world! from POST method" }, { status: 200 })
}