import csv
from io import StringIO
from flask import make_response

def export_to_csv(records, columns, filename):
    """
    Export a list of records to CSV.
    
    Args:
        records: List of SQLAlchemy model instances
        columns: List of tuples (column_name, attribute_name)
        filename: Name of the CSV file to download
    
    Returns:
        Flask response with CSV file
    """
    output = StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([col[0] for col in columns])
    
    # Write data
    for record in records:
        row = []
        for _, attr in columns:
            value = getattr(record, attr)
            if isinstance(value, (bool, int, float)):
                row.append(value)
            elif value is None:
                row.append('')
            elif attr == 'created_at' or attr == 'timestamp':
                row.append(value.strftime('%Y-%m-%d %H:%M:%S'))
            else:
                row.append(str(value))
        writer.writerow(row)
    
    output.seek(0)
    response = make_response(output.getvalue())
    response.headers['Content-Disposition'] = f'attachment; filename={filename}'
    response.headers['Content-Type'] = 'text/csv'
    return response