"""Add image_url to assets and create asset_images table

Revision ID: 7b526d8b5688
Revises: None
Create Date: 2025-07-24 05:40:14.825870
"""

from alembic import op
import sqlalchemy as sa

# Revision identifiers, used by Alembic
revision = '7b526d8b5688'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Create asset_images table
    op.create_table(
        'asset_images',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('url', sa.String(), nullable=False),
        sa.Column('uploaded_by', sa.Integer(), nullable=False),
        sa.Column('uploaded_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['uploaded_by'], ['users.id'])
    )

    # Add image_url column to assets table
    with op.batch_alter_table('assets', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image_url', sa.String(length=255), nullable=True))

    # Optional: Add fields to categories table (commented out for now)
    # with op.batch_alter_table('categories', schema=None) as batch_op:
    #     batch_op.add_column(sa.Column('description', sa.Text(), nullable=True))
    #     batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=True))


def downgrade():
    # Remove optional fields from categories table (commented out for safety)
    # with op.batch_alter_table('categories', schema=None) as batch_op:
    #     batch_op.drop_column('created_at')
    #     batch_op.drop_column('description')

    # Remove image_url column from assets table
    with op.batch_alter_table('assets', schema=None) as batch_op:
        batch_op.drop_column('image_url')

    # Drop asset_images table
    op.drop_table('asset_images')
