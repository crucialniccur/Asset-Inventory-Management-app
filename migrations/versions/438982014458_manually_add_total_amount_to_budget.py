"""Manually add total_amount to Budget

Revision ID: 438982014458
Revises: aba329b3c4ee
Create Date: 2025-07-31 09:53:54.075389

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '438982014458'
down_revision = 'aba329b3c4ee'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('budgets', sa.Column('total_amount', sa.Float(), nullable=False, server_default="0"))
    op.add_column('budgets', sa.Column('created_at', sa.DateTime(), nullable=True))


def downgrade():
    op.drop_column('budgets', 'created_at')
    op.drop_column('budgets', 'total_amount')

