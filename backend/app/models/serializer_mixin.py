from datetime import datetime
from enum import Enum

class SerializerMixin:
    def to_dict(self):
        result = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)
            if isinstance(value, datetime):
                result[column.name] = value.isoformat()
            elif isinstance(value, Enum):
                result[column.name] = value.value
            else:
                result[column.name] = value
        return result
