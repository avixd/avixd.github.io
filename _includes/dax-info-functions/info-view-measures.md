`INFO.VIEW.MEASURES()` returns one row per measure in the semantic model — its name, home table, description, DAX formula, format string and more. Microsoft positions it for exactly this job: understanding a model and **self-documenting it when used in a calculated table**.

### Quick start

The video uses the fastest route. In Power BI Desktop, go to **Table view → New table** and enter:

```dax
Model Measures = INFO.VIEW.MEASURES()
```

For an ad-hoc audit that leaves nothing behind in the model, run it in **DAX query view** instead:

```dax
EVALUATE
    INFO.VIEW.MEASURES()
```

### What it returns

| Column | What it tells you |
| --- | --- |
| `ID` | Internal integer ID of the measure |
| `Name` | Measure name |
| `Table` | Home table, by name rather than ID |
| `Description` | The description shown in tooltips across Power BI and Excel |
| `DataType` | Data type of the result |
| `Expression` | The full DAX formula |
| `FormatString` | Static format string, for example `0.00%;-0.00%;0.00%` |
| `FormatStringDefinition` | Dynamic format string expression, if one is set |
| `IsHidden` | Whether the measure is hidden from report authors |
| `State` | `Valid` when the formula evaluates; anything else points at a broken measure |
| `DisplayFolder` | Folder path — nested folders use `/`, multiple folders are separated by `;` |
| `DetailRowsDefinition` | Detail Rows expression used for drill-through, if defined |
| `DataCategory` | Data category of the measure |
| `KPIID` | ID of the KPI attached to the measure, if any |
| `IsSimpleMeasure` | The simple-measure flag (`True`/`False`) |
| `LineageTag` | Stable identifier that follows the measure through renames and deployments |

### Where it runs — and where it doesn't

- **Works in** calculated tables, calculated columns, measures and DAX queries. This is what separates the `INFO.VIEW.*` family from the plain `INFO.*` functions, which are limited to DAX queries.
- **Refreshes with the model.** A calculated table built on it updates when the model is refreshed — not the instant you edit a measure.
- **Needs write permission** on the semantic model.
- **Doesn't run over a live connection.** A thin report live-connected to a shared semantic model can't call it; open the model itself instead.

### Audit queries worth keeping

Run these in DAX query view. Each one turns a documentation standard into a list you can act on.

**Measures with no description** — the documentation gap report users feel most:

```dax
EVALUATE
    FILTER (
        INFO.VIEW.MEASURES (),
        LEN ( [Description] ) = 0
    )
ORDER BY [Table], [Name]
```

**Broken measures** — anything that no longer evaluates:

```dax
EVALUATE
    FILTER ( INFO.VIEW.MEASURES (), [State] <> "Valid" )
```

**Measures outside a display folder** — clutter in the field list:

```dax
EVALUATE
    FILTER ( INFO.VIEW.MEASURES (), LEN ( [DisplayFolder] ) = 0 )
ORDER BY [Table], [Name]
```

**A clean data dictionary** — only the columns a reader needs:

```dax
EVALUATE
    SELECTCOLUMNS (
        INFO.VIEW.MEASURES (),
        "Table", [Table],
        "Folder", [DisplayFolder],
        "Measure", [Name],
        "Description", [Description],
        "Formula", [Expression],
        "Format", [FormatString]
    )
ORDER BY [Table], [Folder], [Measure]
```

### Strengths for model documentation

- **Built in.** No DAX Studio, Tabular Editor or scripts required — it ships with Power BI Desktop, so any developer on the team can use it.
- **Always matches the model.** The output is read from the model's own metadata, so it can't drift the way a hand-maintained spreadsheet does.
- **Readable without joins.** It returns table *names* instead of IDs, unlike `INFO.MEASURES()`, so it's usable as-is.
- **Makes documentation debt measurable.** Blank descriptions, missing folders and broken formulas become filterable rows — easy to track in a review or a release checklist.
- **Exportable.** Copy the query result into Excel or a wiki to hand stakeholders a data dictionary.

### Limitations and risks

- **Garbage in, garbage out.** It only surfaces the metadata you've written. With empty `Description` fields, the "documentation" is just a list of formulas.
- **Stale between refreshes.** A calculated table reflects the model as of the last refresh. Refresh before you publish or trust it in a review.
- **It can expose logic you meant to keep internal.** Stored as a calculated table, it copies every formula — including hidden measures — into data anyone with read access can see in a report or in Analyze in Excel. Hide the table at minimum, and keep it out of models published to external or broad audiences.
- **Measures only.** Columns, tables and relationships need their own functions — `INFO.VIEW.COLUMNS()`, `INFO.VIEW.TABLES()`, `INFO.VIEW.RELATIONSHIPS()`.
- **A snapshot, not a history.** It shows what the model *is*, not what changed or who changed it. Version control (PBIP/TMDL in Git) covers that.
- **Author-only.** The write-permission and live-connection limits mean report consumers and thin-report builders can't run it themselves.

### Recommended practice

1. **Audit in DAX query view.** It leaves no footprint in the model and exposes nothing to report consumers.
2. **Enforce a standard, then check it.** Treat "every visible measure has a description and a display folder" as a definition of done. The first and third queries above are the check.
3. **Ship a calculated table only when you want an in-report data dictionary** — and then hide it, keep its page restricted, and remember it updates on refresh.
4. **Pair it with source control.** Use `INFO.VIEW.MEASURES()` for the readable catalogue and PBIP/TMDL in Git for change history.

### References

- [INFO.VIEW.MEASURES function (DAX) — Microsoft Learn](https://learn.microsoft.com/en-us/dax/info-view-measures-function-dax)
- [INFO functions (DAX) — Microsoft Learn](https://learn.microsoft.com/en-us/dax/info-functions-dax)
- [INFO.MEASURES function (DAX) — Microsoft Learn](https://learn.microsoft.com/en-us/dax/info-measures-function-dax)
- [INFO.VIEW.COLUMNS function (DAX) — Microsoft Learn](https://learn.microsoft.com/en-us/dax/info-view-columns-function-dax)
