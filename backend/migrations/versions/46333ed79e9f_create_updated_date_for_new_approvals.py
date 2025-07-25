"""create updated date for new approvals

Revision ID: 46333ed79e9f
Revises: 82e373f4e739
Create Date: 2025-07-24 10:21:37.626071

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '46333ed79e9f'
down_revision = '82e373f4e739'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('requests', schema=None) as batch_op:
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('requests', schema=None) as batch_op:
        batch_op.drop_column('updated_at')

    # ### end Alembic commands ###
