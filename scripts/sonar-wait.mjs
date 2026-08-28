const host = process.env.SONAR_HOST_URL ?? "https://sonar.starci.org"
const token = process.env.SONAR_TOKEN
const taskId = process.env.SONAR_CE_TASK_ID
const project = process.env.SONAR_PROJECT_KEY ?? "starci-skills-fe"

if (!token || !taskId) {
    console.error("sonar: unmeasured (SONAR_TOKEN and SONAR_CE_TASK_ID are required; values are never printed)")
    process.exit(1)
}

const auth = {headers: {Authorization: `Basic ${Buffer.from(`${token}:`).toString("base64")}`}}
const get = async (path) => {
    const response = await fetch(`${host.replace(/\/$/, "")}${path}`, auth)
    if (!response.ok) throw new Error(`Sonar API ${response.status}`)
    return response.json()
}

for (let attempt = 0; attempt < 60; attempt += 1) {
    const task = (await get(`/api/ce/task?id=${encodeURIComponent(taskId)}`)).task
    if (task.status === "SUCCESS") {
        const gate = (await get(`/api/qualitygates/project_status?projectKey=${encodeURIComponent(project)}`)).projectStatus
        if (gate.status !== "OK") throw new Error(`Sonar quality gate: ${gate.status}`)
        console.log("sonar: quality gate OK")
        process.exit(0)
    }
    if (["FAILED", "CANCELED"].includes(task.status)) throw new Error(`Sonar task: ${task.status}`)
    await new Promise((resolve) => setTimeout(resolve, 5_000))
}
throw new Error("Sonar task did not finish within the local wait window")
