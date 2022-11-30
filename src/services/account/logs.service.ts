import { LogEntry } from "../../interface/common.interface"
import { ParseDatesReviver } from "../../util/json.util"
import http from "../http"

function all(accountId: string): Promise<LogEntry[]> {
    return http.get(`/account/${accountId}/log-entry`)
}

function deleteAll(accounId: string): Promise<{ deletedCount: number }> {
    return http.delete(`account/${accounId}/log-entry`)
}

const logsService = {
    all,
    deleteAll
}

export default logsService