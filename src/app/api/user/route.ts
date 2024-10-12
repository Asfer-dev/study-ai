import { fetchUser, fetchUsers } from "@/helpers/fetch-users";

export async function GET(req: Request) {
  try {
    // Extract the search parameters (for query params) from the request URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let users;

    if (id) {
      // If an id is provided, fetch only the specific user
      users = await fetchUser(id); // Assuming fetchUsers can handle an id param
    } else {
      // If no id is provided, fetch all users
      users = await fetchUsers();
    }

    // Return the users in a JSON response
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response("An error occurred while fetching users", {
      status: 500,
    });
  }
}
