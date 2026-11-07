# A2A Contracts — Proposed Design Artefacts

**Project:** Autonomous Enterprise Decision Intelligence Platform  
**Status:** Architecture and design study — not implemented-system output  
**Contract version:** `v1`  
**Schema dialect:** JSON Schema Draft 2020-12

> All identifiers, timestamps, evidence locators and scenario content below are illustrative. They demonstrate contract shape and validation behaviour; they are not market research, customer evidence, execution records or benchmark results.

## 1. Purpose and boundary

These contracts define structured application-level artefacts exchanged between independent agents. They deliberately replace free-form inter-agent chat with versioned, validatable messages that carry provenance, assumptions, uncertainty, review state and authority limits.

“A2A” here describes the proposed agent-to-agent artefact layer. These schemas are transport-independent and do **not** claim conformance to a particular external A2A protocol.

The intended flow is:

`Decision brief → DomainFinding → ReviewChallenge → revised DomainFinding → StrategicRecommendation → separate human decision`

A `StrategicRecommendation` cannot approve itself. Human approval must exist as a separate authenticated record in the decision system of record. Any consequential execution must pass through a separate approval-bound tool gateway.

## 2. Shared envelope

| Field | Purpose |
|---|---|
| `contract` | Contract name and major version; consumers must reject unsupported versions. |
| `message_id` | Unique immutable message identifier and idempotency key. |
| `decision_brief_id` | Ties the message to one authorised decision brief. |
| `correlation_id` | Groups all artefacts belonging to one decision workflow. |
| `causation_id` | Identifies the message or brief event that directly caused this artefact. |
| `trace_id` | Correlates audit and observability records across the workflow. |
| `producer` | Declares the producing agent role and instance; this declaration is not authentication. |
| `created_at` | UTC timestamp for the artefact. |
| `authority` | Explicitly denies capital commitment, expenditure approval and consequential execution. |

Read-only evidence retrieval may be permitted by the decision brief. `may_execute: false` refers to consequential action; it does not prohibit allow-listed read tools.

## 3. `DomainFinding`

A domain agent’s bounded analytical output. It must identify its domain, state its evidence and assumptions, explain uncertainty and confidence, and enter review without granting itself authority.

### JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ai.mileswaite.net/contracts/domain-finding/v1.schema.json",
  "title": "DomainFinding",
  "description": "Proposed, transport-independent domain-analysis artefact for the decision-intelligence design study.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "contract",
    "message_id",
    "decision_brief_id",
    "correlation_id",
    "causation_id",
    "trace_id",
    "producer",
    "created_at",
    "finding_id",
    "finding_version",
    "domain",
    "finding",
    "evidence",
    "assumptions",
    "uncertainty",
    "confidence",
    "review",
    "authority"
  ],
  "properties": {
    "contract": {
      "const": "domain-finding/v1"
    },
    "message_id": {
      "type": "string",
      "format": "uuid"
    },
    "decision_brief_id": {
      "type": "string",
      "format": "uuid"
    },
    "correlation_id": {
      "type": "string",
      "format": "uuid"
    },
    "causation_id": {
      "type": "string",
      "format": "uuid"
    },
    "trace_id": {
      "type": "string",
      "pattern": "^[0-9a-f]{32}$"
    },
    "producer": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "agent_id",
        "role",
        "instance_id"
      ],
      "properties": {
        "agent_id": {
          "type": "string",
          "minLength": 1
        },
        "role": {
          "const": "domain_agent"
        },
        "instance_id": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "finding_id": {
      "type": "string",
      "format": "uuid"
    },
    "finding_version": {
      "type": "integer",
      "minimum": 1
    },
    "domain": {
      "enum": [
        "financial",
        "commercial",
        "operational",
        "risk"
      ]
    },
    "finding": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "statement",
        "scope",
        "implications"
      ],
      "properties": {
        "statement": {
          "type": "string",
          "minLength": 1
        },
        "scope": {
          "type": "string",
          "minLength": 1
        },
        "implications": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "string",
            "minLength": 1
          }
        }
      }
    },
    "evidence": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "evidence_id",
          "source_type",
          "locator",
          "captured_at",
          "provenance_status",
          "summary"
        ],
        "properties": {
          "evidence_id": {
            "type": "string",
            "pattern": "^ev-[a-z0-9-]+$"
          },
          "source_type": {
            "enum": [
              "system_record",
              "document",
              "external_source",
              "human_input",
              "scenario_assumption"
            ]
          },
          "locator": {
            "type": "string",
            "format": "uri"
          },
          "captured_at": {
            "type": "string",
            "format": "date-time"
          },
          "provenance_status": {
            "enum": [
              "observed",
              "derived",
              "illustrative"
            ]
          },
          "summary": {
            "type": "string",
            "minLength": 1
          }
        }
      }
    },
    "assumptions": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "assumption_id",
          "statement",
          "sensitivity"
        ],
        "properties": {
          "assumption_id": {
            "type": "string",
            "pattern": "^asm-[a-z0-9-]+$"
          },
          "statement": {
            "type": "string",
            "minLength": 1
          },
          "sensitivity": {
            "enum": [
              "low",
              "medium",
              "high"
            ]
          }
        }
      }
    },
    "uncertainty": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "statement",
          "materiality",
          "resolution"
        ],
        "properties": {
          "statement": {
            "type": "string",
            "minLength": 1
          },
          "materiality": {
            "enum": [
              "low",
              "medium",
              "high"
            ]
          },
          "resolution": {
            "type": "string",
            "minLength": 1
          }
        }
      }
    },
    "confidence": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "band",
        "rationale"
      ],
      "properties": {
        "band": {
          "enum": [
            "low",
            "medium",
            "high"
          ]
        },
        "rationale": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "review": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "status",
        "revision_round"
      ],
      "properties": {
        "status": {
          "enum": [
            "pending",
            "under_review",
            "accepted",
            "revision_requested"
          ]
        },
        "revision_round": {
          "type": "integer",
          "minimum": 0,
          "maximum": 3
        }
      }
    },
    "authority": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "may_commit_capital",
        "may_approve_expenditure",
        "may_execute"
      ],
      "properties": {
        "may_commit_capital": {
          "const": false
        },
        "may_approve_expenditure": {
          "const": false
        },
        "may_execute": {
          "const": false
        }
      }
    }
  }
}
```

### Illustrative payload

```json
{
  "contract": "domain-finding/v1",
  "message_id": "f1000000-0000-4000-8000-000000000001",
  "decision_brief_id": "7e0b38c0-72c0-4c6f-a23c-bca05a790001",
  "correlation_id": "c0b15152-38eb-4a93-9118-83833c4d7001",
  "causation_id": "b1000000-0000-4000-8000-000000000001",
  "trace_id": "0123456789abcdef0123456789abcdef",
  "producer": {
    "agent_id": "financial-agent",
    "role": "domain_agent",
    "instance_id": "financial-agent-example-01"
  },
  "created_at": "2026-01-15T10:30:00Z",
  "finding_id": "f1000000-0000-4000-8000-000000000101",
  "finding_version": 1,
  "domain": "financial",
  "finding": {
    "statement": "Under the illustrative cost and demand assumptions, a bounded pilot is financially preferable to immediate full-market entry.",
    "scope": "Illustrative German-market expansion scenario only.",
    "implications": [
      "Do not treat the pilot case as evidence for immediate full-market entry."
    ]
  },
  "evidence": [
    {
      "evidence_id": "ev-fin-001",
      "source_type": "scenario_assumption",
      "locator": "urn:case-study:germany-expansion:financial-assumptions:001",
      "captured_at": "2026-01-15T10:20:00Z",
      "provenance_status": "illustrative",
      "summary": "Hypothetical pilot-cost and demand assumptions supplied by the design scenario; not observed market data."
    }
  ],
  "assumptions": [
    {
      "assumption_id": "asm-fin-001",
      "statement": "Pilot costs remain within the scenario envelope.",
      "sensitivity": "high"
    }
  ],
  "uncertainty": [
    {
      "statement": "Independent demand, acquisition-cost and regulatory-cost evidence has not been supplied.",
      "materiality": "high",
      "resolution": "Obtain independently sourced evidence before any expenditure decision."
    }
  ],
  "confidence": {
    "band": "low",
    "rationale": "The statement tests internal scenario logic only; it is not validated market research."
  },
  "review": {
    "status": "pending",
    "revision_round": 0
  },
  "authority": {
    "may_commit_capital": false,
    "may_approve_expenditure": false,
    "may_execute": false
  }
}
```

## 4. `ReviewChallenge`

A critical-review artefact targeting exactly one immutable `DomainFinding` version. A challenge requests a bounded revision; it does not silently rewrite the original finding.

### JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ai.mileswaite.net/contracts/review-challenge/v1.schema.json",
  "title": "ReviewChallenge",
  "description": "Proposed critical-review artefact targeting one immutable DomainFinding version.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "contract",
    "message_id",
    "decision_brief_id",
    "correlation_id",
    "causation_id",
    "trace_id",
    "producer",
    "created_at",
    "challenge_id",
    "target",
    "challenge_type",
    "severity",
    "statement",
    "evidence_refs",
    "requested_revision",
    "review_round",
    "resolution",
    "authority"
  ],
  "properties": {
    "contract": {
      "const": "review-challenge/v1"
    },
    "message_id": {
      "type": "string",
      "format": "uuid"
    },
    "decision_brief_id": {
      "type": "string",
      "format": "uuid"
    },
    "correlation_id": {
      "type": "string",
      "format": "uuid"
    },
    "causation_id": {
      "type": "string",
      "format": "uuid"
    },
    "trace_id": {
      "type": "string",
      "pattern": "^[0-9a-f]{32}$"
    },
    "producer": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "agent_id",
        "role",
        "instance_id"
      ],
      "properties": {
        "agent_id": {
          "type": "string",
          "minLength": 1
        },
        "role": {
          "const": "critical_review_agent"
        },
        "instance_id": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "challenge_id": {
      "type": "string",
      "format": "uuid"
    },
    "target": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "finding_id",
        "finding_version",
        "finding_message_id"
      ],
      "properties": {
        "finding_id": {
          "type": "string",
          "format": "uuid"
        },
        "finding_version": {
          "type": "integer",
          "minimum": 1
        },
        "finding_message_id": {
          "type": "string",
          "format": "uuid"
        }
      }
    },
    "challenge_type": {
      "enum": [
        "evidence_gap",
        "unsupported_inference",
        "stale_evidence",
        "permission_violation",
        "scope_violation",
        "contradiction",
        "uncertainty_omission"
      ]
    },
    "severity": {
      "enum": [
        "low",
        "medium",
        "high",
        "critical"
      ]
    },
    "statement": {
      "type": "string",
      "minLength": 1
    },
    "evidence_refs": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^ev-[a-z0-9-]+$"
      },
      "uniqueItems": true
    },
    "requested_revision": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "action",
        "acceptance_criteria"
      ],
      "properties": {
        "action": {
          "enum": [
            "provide_evidence",
            "narrow_claim",
            "recompute",
            "add_uncertainty",
            "escalate_to_human"
          ]
        },
        "acceptance_criteria": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "string",
            "minLength": 1
          }
        }
      }
    },
    "review_round": {
      "type": "integer",
      "minimum": 1,
      "maximum": 3
    },
    "resolution": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "status",
        "resolved_by_finding_id"
      ],
      "properties": {
        "status": {
          "enum": [
            "open",
            "resolved",
            "superseded"
          ]
        },
        "resolved_by_finding_id": {
          "anyOf": [
            {
              "type": "string",
              "format": "uuid"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "authority": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "may_commit_capital",
        "may_approve_expenditure",
        "may_execute"
      ],
      "properties": {
        "may_commit_capital": {
          "const": false
        },
        "may_approve_expenditure": {
          "const": false
        },
        "may_execute": {
          "const": false
        }
      }
    }
  }
}
```

### Illustrative payload

```json
{
  "contract": "review-challenge/v1",
  "message_id": "f2000000-0000-4000-8000-000000000001",
  "decision_brief_id": "7e0b38c0-72c0-4c6f-a23c-bca05a790001",
  "correlation_id": "c0b15152-38eb-4a93-9118-83833c4d7001",
  "causation_id": "f1000000-0000-4000-8000-000000000001",
  "trace_id": "0123456789abcdef0123456789abcdef",
  "producer": {
    "agent_id": "critical-review-agent",
    "role": "critical_review_agent",
    "instance_id": "critical-review-agent-example-01"
  },
  "created_at": "2026-01-15T10:35:00Z",
  "challenge_id": "f2000000-0000-4000-8000-000000000101",
  "target": {
    "finding_id": "f1000000-0000-4000-8000-000000000101",
    "finding_version": 1,
    "finding_message_id": "f1000000-0000-4000-8000-000000000001"
  },
  "challenge_type": "evidence_gap",
  "severity": "high",
  "statement": "The finding moves from scenario arithmetic to a market-entry preference without independent demand or cost evidence.",
  "evidence_refs": [
    "ev-fin-001"
  ],
  "requested_revision": {
    "action": "narrow_claim",
    "acceptance_criteria": [
      "Label the pilot statement as conditional on the scenario assumptions.",
      "Remove any implication for immediate full-market entry.",
      "Record the independent-evidence gap explicitly."
    ]
  },
  "review_round": 1,
  "resolution": {
    "status": "open",
    "resolved_by_finding_id": null
  },
  "authority": {
    "may_commit_capital": false,
    "may_approve_expenditure": false,
    "may_execute": false
  }
}
```

## 5. `StrategicRecommendation`

A conditional synthesis of reviewed domain findings. It preserves unresolved disagreement and monitoring triggers. The schema makes `human_decision.status` permanently `pending` and `execution.status` permanently `not_authorised` within this agent-produced artefact.

### JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ai.mileswaite.net/contracts/strategic-recommendation/v1.schema.json",
  "title": "StrategicRecommendation",
  "description": "Proposed conditional recommendation. It cannot encode human approval or authorise execution.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "contract",
    "message_id",
    "decision_brief_id",
    "correlation_id",
    "causation_id",
    "trace_id",
    "producer",
    "created_at",
    "recommendation_id",
    "based_on",
    "review",
    "recommendation",
    "assumptions",
    "uncertainties",
    "monitoring",
    "human_decision",
    "execution",
    "authority"
  ],
  "properties": {
    "contract": {
      "const": "strategic-recommendation/v1"
    },
    "message_id": {
      "type": "string",
      "format": "uuid"
    },
    "decision_brief_id": {
      "type": "string",
      "format": "uuid"
    },
    "correlation_id": {
      "type": "string",
      "format": "uuid"
    },
    "causation_id": {
      "type": "string",
      "format": "uuid"
    },
    "trace_id": {
      "type": "string",
      "pattern": "^[0-9a-f]{32}$"
    },
    "producer": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "agent_id",
        "role",
        "instance_id"
      ],
      "properties": {
        "agent_id": {
          "type": "string",
          "minLength": 1
        },
        "role": {
          "const": "strategic_agent"
        },
        "instance_id": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "recommendation_id": {
      "type": "string",
      "format": "uuid"
    },
    "based_on": {
      "type": "array",
      "minItems": 4,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "finding_id",
          "finding_version",
          "domain"
        ],
        "properties": {
          "finding_id": {
            "type": "string",
            "format": "uuid"
          },
          "finding_version": {
            "type": "integer",
            "minimum": 1
          },
          "domain": {
            "enum": [
              "financial",
              "commercial",
              "operational",
              "risk"
            ]
          }
        }
      }
    },
    "review": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "status",
        "review_rounds",
        "challenge_ids",
        "unresolved_disagreement"
      ],
      "properties": {
        "status": {
          "enum": [
            "in_progress",
            "blocked",
            "completed",
            "completed_with_unresolved_disagreement"
          ]
        },
        "review_rounds": {
          "type": "integer",
          "minimum": 0,
          "maximum": 3
        },
        "challenge_ids": {
          "type": "array",
          "items": {
            "type": "string",
            "format": "uuid"
          },
          "uniqueItems": true
        },
        "unresolved_disagreement": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": [
              "topic",
              "positions",
              "why_unresolved"
            ],
            "properties": {
              "topic": {
                "type": "string",
                "minLength": 1
              },
              "positions": {
                "type": "array",
                "minItems": 2,
                "items": {
                  "type": "string",
                  "minLength": 1
                }
              },
              "why_unresolved": {
                "type": "string",
                "minLength": 1
              }
            }
          }
        }
      },
      "allOf": [
        {
          "if": {
            "properties": {
              "status": {
                "const": "completed_with_unresolved_disagreement"
              }
            }
          },
          "then": {
            "properties": {
              "unresolved_disagreement": {
                "minItems": 1
              }
            }
          }
        },
        {
          "if": {
            "properties": {
              "status": {
                "const": "completed"
              }
            }
          },
          "then": {
            "properties": {
              "unresolved_disagreement": {
                "maxItems": 0
              }
            }
          }
        }
      ]
    },
    "recommendation": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "decision",
        "rationale",
        "conditions",
        "alternatives_considered"
      ],
      "properties": {
        "decision": {
          "type": "string",
          "minLength": 1
        },
        "rationale": {
          "type": "string",
          "minLength": 1
        },
        "conditions": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "string",
            "minLength": 1
          }
        },
        "alternatives_considered": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": [
              "option",
              "reason_not_selected"
            ],
            "properties": {
              "option": {
                "type": "string",
                "minLength": 1
              },
              "reason_not_selected": {
                "type": "string",
                "minLength": 1
              }
            }
          }
        }
      }
    },
    "assumptions": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "string",
        "minLength": 1
      }
    },
    "uncertainties": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "string",
        "minLength": 1
      }
    },
    "monitoring": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "trigger_id",
          "condition",
          "action",
          "owner_role"
        ],
        "properties": {
          "trigger_id": {
            "type": "string",
            "pattern": "^trg-[a-z0-9-]+$"
          },
          "condition": {
            "type": "string",
            "minLength": 1
          },
          "action": {
            "enum": [
              "reopen_decision",
              "pause_execution",
              "notify_owner"
            ]
          },
          "owner_role": {
            "const": "human_decision_owner"
          }
        }
      }
    },
    "human_decision": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "status",
        "decision_ref"
      ],
      "properties": {
        "status": {
          "const": "pending"
        },
        "decision_ref": {
          "type": "null"
        }
      }
    },
    "execution": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "status",
        "execution_ref"
      ],
      "properties": {
        "status": {
          "const": "not_authorised"
        },
        "execution_ref": {
          "type": "null"
        }
      }
    },
    "authority": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "may_commit_capital",
        "may_approve_expenditure",
        "may_execute"
      ],
      "properties": {
        "may_commit_capital": {
          "const": false
        },
        "may_approve_expenditure": {
          "const": false
        },
        "may_execute": {
          "const": false
        }
      }
    }
  }
}
```

### Illustrative payload

```json
{
  "contract": "strategic-recommendation/v1",
  "message_id": "f3000000-0000-4000-8000-000000000001",
  "decision_brief_id": "7e0b38c0-72c0-4c6f-a23c-bca05a790001",
  "correlation_id": "c0b15152-38eb-4a93-9118-83833c4d7001",
  "causation_id": "f2000000-0000-4000-8000-000000000001",
  "trace_id": "0123456789abcdef0123456789abcdef",
  "producer": {
    "agent_id": "strategic-agent",
    "role": "strategic_agent",
    "instance_id": "strategic-agent-example-01"
  },
  "created_at": "2026-01-15T10:45:00Z",
  "recommendation_id": "f3000000-0000-4000-8000-000000000101",
  "based_on": [
    {
      "finding_id": "f1000000-0000-4000-8000-000000000101",
      "finding_version": 2,
      "domain": "financial"
    },
    {
      "finding_id": "f1000000-0000-4000-8000-000000000102",
      "finding_version": 1,
      "domain": "commercial"
    },
    {
      "finding_id": "f1000000-0000-4000-8000-000000000103",
      "finding_version": 1,
      "domain": "operational"
    },
    {
      "finding_id": "f1000000-0000-4000-8000-000000000104",
      "finding_version": 1,
      "domain": "risk"
    }
  ],
  "review": {
    "status": "completed_with_unresolved_disagreement",
    "review_rounds": 2,
    "challenge_ids": [
      "f2000000-0000-4000-8000-000000000101"
    ],
    "unresolved_disagreement": [
      {
        "topic": "Appropriate pilot scale",
        "positions": [
          "Commercial favours a larger pilot to improve signal quality.",
          "Risk favours a smaller pilot to limit downside exposure."
        ],
        "why_unresolved": "The illustrative scenario contains no validated evidence resolving the trade-off."
      }
    ]
  },
  "recommendation": {
    "decision": "Recommend a bounded, reversible pilot only after specified evidence gates are met; do not approve full-market entry.",
    "rationale": "A conditional pilot limits irreversible exposure while testing the assumptions on which the commercial and financial findings depend.",
    "conditions": [
      "A human decision owner approves the pilot scope and expenditure separately.",
      "Independent demand and cost evidence is reviewed before approval.",
      "The operational and risk findings confirm that the pilot remains reversible."
    ],
    "alternatives_considered": [
      {
        "option": "Immediate full-market entry",
        "reason_not_selected": "The illustrative evidence does not resolve material demand, cost or execution uncertainty."
      },
      {
        "option": "No further investigation",
        "reason_not_selected": "A bounded pilot could reduce uncertainty if the human owner accepts the residual risk."
      }
    ]
  },
  "assumptions": [
    "A pilot can be stopped without creating material downstream obligations."
  ],
  "uncertainties": [
    "The scenario does not establish actual German demand, acquisition costs, regulatory effort or delivery capacity."
  ],
  "monitoring": [
    {
      "trigger_id": "trg-pilot-001",
      "condition": "Validated evidence invalidates a material pilot assumption.",
      "action": "reopen_decision",
      "owner_role": "human_decision_owner"
    },
    {
      "trigger_id": "trg-pilot-002",
      "condition": "The approved pilot boundary or reversal path is no longer intact.",
      "action": "pause_execution",
      "owner_role": "human_decision_owner"
    }
  ],
  "human_decision": {
    "status": "pending",
    "decision_ref": null
  },
  "execution": {
    "status": "not_authorised",
    "execution_ref": null
  },
  "authority": {
    "may_commit_capital": false,
    "may_approve_expenditure": false,
    "may_execute": false
  }
}
```

**Example-chain note:** the review challenge targets financial finding version 1. The recommendation intentionally references version 2, representing the revised finding after that challenge. Version 2 is not reproduced here; the reference illustrates revision semantics rather than claiming a completed run.

## 6. Validation rules

JSON Schema alone is insufficient. A runtime implementing this design should apply the following layers in order.

### A. Structural validation

1. Parse JSON with defined size and nesting limits; reject malformed or oversized messages before model processing.
2. Validate against the exact `contract` version with `additionalProperties: false`.
3. Require valid UUID, URI and date-time formats using an assertion-enabled format validator.
4. Reject unknown producer roles, unsupported domains, invalid review rounds and any `authority` value set to `true`.
5. Treat `message_id` as an idempotency key; identical IDs with different content must be rejected as conflicts.

### B. Identity, provenance and content safety

6. Authenticate the producer through the runtime and require the authenticated identity to match `producer.agent_id` and `producer.role`. The JSON declaration alone proves nothing.
7. Authorise the producer against the decision brief’s domain and tool permissions; a valid schema must never confer access.
8. Resolve every evidence locator through an allow-listed evidence registry. Do not fetch arbitrary agent-supplied URLs.
9. Preserve `provenance_status: illustrative` when scenario material is used; illustrative evidence must not be promoted to observed evidence by a later agent.
10. Treat evidence text and external content as untrusted data, never as instructions. Scan for injection and apply content/secret/PII policy before downstream use.
11. Require evidence summaries and source locators to support the bounded statement; confidence prose must explain the basis rather than merely assert a score.

### C. Correlation, revision and state

12. All artefacts in one workflow must share the authorised `decision_brief_id`, `correlation_id` and `trace_id`; `causation_id` must reference an existing parent event.
13. A `ReviewChallenge.target` must reference an existing immutable finding ID, version and message ID belonging to the same brief.
14. A revision must create a new `message_id`, retain the `finding_id`, increment `finding_version`, and increment the bounded review round. Never mutate the challenged artefact in place.
15. `review_round` is limited to three. Exhausting the bound must escalate the disagreement to the human owner rather than create an infinite agent loop.
16. A resolved challenge must reference the superseding finding version; an open or superseded challenge cannot silently disappear from the audit trail.
17. `StrategicRecommendation.based_on` must reference the latest reviewed finding versions and include financial, commercial, operational and risk domains. Any missing domain requires an explicit human-approved waiver outside these agent artefacts.
18. An unresolved critical challenge must set the recommendation review state to `blocked`. Other unresolved disagreement may proceed only as visible `completed_with_unresolved_disagreement` content for human consideration.
19. If `review.status` is `completed_with_unresolved_disagreement`, at least one disagreement with two or more positions is mandatory. A plain `completed` state permits none.
20. Every recommendation must retain assumptions, uncertainties, alternatives, conditions and monitoring triggers. Synthesis must not erase minority positions.

### D. Authority and execution

21. Agent artefacts must remain pending human decision and not authorised for execution. An agent-written `approved`, `decision_ref`, `execution_ref` or affirmative authority flag is invalid.
22. Human approval must be a separate authenticated, authorised and immutable decision record referencing the exact recommendation ID and content digest.
23. The execution gateway must independently verify that approval, the approved action scope, tool allow-list and current policy still match. A recommendation is never an execution credential.
24. Approval must not be reusable across changed recommendation content, expanded scope or a materially different decision brief.
25. Monitoring triggers route to the named human owner. Reconsideration reopens the decision workflow; it does not silently grant new agent authority.

## 7. Minimum acceptance tests

| ID | Acceptance test | Expected result |
|---|---|---|
| `DF-01` | Validate the illustrative `DomainFinding`. | Passes schema and format validation. |
| `DF-02` | Remove `evidence`, `confidence.rationale` or `uncertainty`. | Rejected. |
| `DF-03` | Add an undeclared property or set an authority flag to `true`. | Rejected. |
| `RC-01` | Validate the illustrative `ReviewChallenge`. | Passes schema and format validation. |
| `RC-02` | Use review round `4`, omit the target version or omit acceptance criteria. | Rejected. |
| `RC-03` | Target a finding from another decision brief. | Rejected by semantic correlation checks. |
| `SR-01` | Validate the illustrative `StrategicRecommendation`. | Passes schema and format validation. |
| `SR-02` | Set human status to `approved` or execution status to `authorised`. | Rejected by the contract. |
| `SR-03` | Use `completed_with_unresolved_disagreement` with an empty disagreement list. | Rejected. |
| `SR-04` | Omit one required domain or reference a superseded finding. | Rejected by semantic review checks unless a valid external human waiver exists. |
| `SR-05` | Leave a critical challenge unresolved but mark review `completed`. | Rejected; state must be `blocked`. |
| `AUTH-01` | Present a valid recommendation directly to the execution gateway. | Execution denied; separate valid human approval is required. |

## 8. Design principle

The contract layer is not the control boundary by itself. Schemas make intent and evidence explicit; authenticated identity, policy enforcement, immutable revision history, human decision records and an independent execution gateway make the authority boundary real.
