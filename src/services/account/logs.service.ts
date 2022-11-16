import { LogEntry } from "../../interface/common.interface"
import { ParseDatesReviver } from "../../util/json.util"
import http from "../http"

function mockLogs() {
    const mockLogsData = `[
        {
            "id": "6",
            "status": "successful",
            "timestamp": "2022-11-15 07:10:00",
            "error": null,
            "message": "Finished successfully !",
            "action": "start_btn",
            "config_type": "CONFIG_TYPE_WEEKLY"
        },
        {
            "id": "7",
            "status": "successful",
            "timestamp": "2022-11-15 07:15:00",
            "error": null,
            "message": "Finished successfully !",
            "action": "stop_btn",
            "config_type": "CONFIG_TYPE_WEEKLY"
        },
        {
            "id": "7",
            "status": "failed",
            "timestamp": "2022-11-15 07:15:00",
            "error": "error",
            "message": null,
            "action": "stop_btn",
            "config_type": "CONFIG_TYPE_WEEKLY"
        }
    ]`
    return JSON.parse(mockLogsData, ParseDatesReviver)
}

function all(accountId: string): Promise<LogEntry[]> {
    return Promise.resolve(mockLogs())
    // TODO: uncomment
    // return http.get(`/account/${accountId}/log-entry`)
}

function deleteAll(accounId: string): Promise<{ deletedCount: number }> {
    return http.delete(`account/${accounId}/log-entry`)
}

const logsService = {
    all,
    deleteAll
}

export default logsService