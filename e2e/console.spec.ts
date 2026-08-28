import {expect, test} from "@playwright/test"

test("serves the console over HTTP and exposes the workspace view", async ({page}) => {
    await page.goto("/")
    await expect(page.getByRole("heading", {name: "StarCi Skills"})).toBeVisible()
    await expect(page.getByRole("tab", {name: /Workspaces/})).toBeVisible()
    await expect(page.getByText("Source:")).toBeVisible()
})

test("switches between the three read-only panels", async ({page}) => {
    await page.goto("/")
    await page.getByRole("tab", {name: /Registries/}).click()
    await expect(page.getByText(/Registry|No registry/i).first()).toBeVisible()
    await page.getByRole("tab", {name: /Sessions/}).click()
    await expect(page.getByText(/Session|No session/i).first()).toBeVisible()
})
