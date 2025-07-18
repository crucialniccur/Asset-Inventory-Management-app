/* form validation */
import { render, screen, fireEvent } from "@testing-library/react";
import RequestForm from "../components/RequestForm";
import { act } from "react-dom/test-utils";

test("shows validation errors", async () => {
  render(<RequestForm />);

  await act(async () => {
    fireEvent.click(screen.getByText(/submit request/i));
  });

  expect(await screen.findByText("Asset type is required")).toBeInTheDocument();
  expect(screen.getByText("Quantity must be a number")).toBeInTheDocument();
});

/* form submission */
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen, fireEvent } from "@testing-library/react";
import RequestForm from "../components/RequestForm";
import { act } from "react-dom/test-utils";

const server = setupServer(
  rest.post("/requests", (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ message: "Request submitted" }));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

test("submits form successfully", async () => {
  render(<RequestForm />);

  fireEvent.change(screen.getByLabelText(/asset type/i), {
    target: { value: "Monitor" }
  });
  fireEvent.change(screen.getByLabelText(/urgency/i), {
    target: { value: "High" }
  });
  fireEvent.change(screen.getByLabelText(/quantity/i), {
    target: { value: "1" }
  });
  fireEvent.change(screen.getByLabelText(/reason/i), {
    target: { value: "Remote setup" }
  });

  await act(async () => {
    fireEvent.click(screen.getByText(/submit request/i));
  });

  expect(await screen.findByText("Request submitted")).toBeInTheDocument();
});


test("shows user's active and completed requests", async () => {
  const mockRequests = [
    { id: 1, asset_type: "Chair", status: "pending" },
    { id: 2, asset_type: "Desk", status: "completed" }
  ];

  server.use(
    rest.get("/requests", (req, res, ctx) => {
      return res(ctx.json(mockRequests));
    })
  );

  render(<UserRequestsList />);

  expect(await screen.findByText("Chair")).toBeInTheDocument();
  expect(screen.getByText("pending")).toBeInTheDocument();
  expect(screen.getByText("Desk")).toBeInTheDocument();
  expect(screen.getByText("completed")).toBeInTheDocument();
});
